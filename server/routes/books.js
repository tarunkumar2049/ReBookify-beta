const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/books?q=&category=&minPrice=&maxPrice=&condition=&listing_type=&status=&sort=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, condition, listing_type, status = 'Available', sort = 'newest', page = 1, limit = 12, mine, owner } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;
    if (category) {
      // allow category name or id
      const cat = await Category.findOne({ $or: [{ _id: /^[0-9a-fA-F]{24}$/.test(category) ? category : '000000000000000000000000' }, { category_name: category }] });
      if (cat) filter.category_id = cat._id;
      else if (/^[0-9a-fA-F]{24}$/.test(category)) filter.category_id = category;
      else filter.category = category;
    }
    if (condition) filter.condition = condition;
    if (listing_type) filter.listing_type = listing_type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };
    if (mine && req.headers.authorization) { /* handled below via owner */ }
    if (owner) filter.user_id = owner;
    // fallback keyword search when text index unavailable
    let query = Book.find(filter).populate('user_id', 'name created_at').populate('category_id', 'category_name');
    if (q && !filter.$text) {
      const rx = new RegExp(q, 'i');
      query = Book.find({ ...filter, $or: [{ title: rx }, { author: rx }, { category: rx }, { description: rx }] })
        .populate('user_id', 'name created_at').populate('category_id', 'category_name');
    }
    const sortMap = {
      newest: { created_at: -1 },
      oldest: { created_at: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'title-asc': { title: 1 },
    };
    query = query.sort(sortMap[sort] || sortMap.newest);
    const pg = Math.max(1, Number(page));
    const lim = Math.min(48, Math.max(1, Number(limit)));
    const total = await Book.countDocuments(query.getFilter());
    const books = await query.skip((pg - 1) * lim).limit(lim);
    res.json({ success: true, total, page: pg, pages: Math.ceil(total / lim), books });
  } catch (e) { next(e); }
});

// GET /api/books/:id
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('user_id', 'name created_at').populate('category_id', 'category_name description');
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    const sellerBooks = await Book.find({ user_id: book.user_id._id, _id: { $ne: book._id }, status: 'Available' }).limit(4);
    res.json({ success: true, book, sellerBooks });
  } catch (e) { next(e); }
});

// POST /api/books (auth)
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, author, category_id, category, price, condition, description, image_url, listing_type } = req.body;
    if (!title || !author || !price) return res.status(400).json({ success: false, message: 'Title, author and price required' });
    let catId = category_id;
    let catName = category || '';
    if (!catId && category) {
      const c = await Category.findOne({ category_name: category });
      if (c) { catId = c._id; catName = c.category_name; }
    }
    if (!catId) {
      const fallback = await Category.findOne();
      if (!fallback) return res.status(400).json({ success: false, message: 'No categories exist yet. Ask admin to seed categories.' });
      catId = fallback._id; catName = catName || fallback.category_name;
    }
    if (!catName) {
      const c = await Category.findById(catId);
      catName = c ? c.category_name : '';
    }
    const book = await Book.create({
      title, author, category_id: catId, category: catName,
      price: Number(price), condition: condition || 'Good',
      description: description || '', image_url: image_url || '',
      listing_type: listing_type || 'Both',
      user_id: req.user._id, status: 'Available'
    });
    res.status(201).json({ success: true, message: 'Book listed successfully', book });
  } catch (e) { next(e); }
});

// PUT /api/books/:id (owner only)
router.put('/:id', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not your listing' });
    const fields = ['title', 'author', 'price', 'condition', 'description', 'image_url', 'status', 'listing_type'];
    fields.forEach((f) => { if (req.body[f] !== undefined) book[f] = req.body[f]; });
    if (req.body.category_id) {
      book.category_id = req.body.category_id;
      const c = await Category.findById(req.body.category_id);
      if (c) book.category = c.category_name;
    } else if (req.body.category) {
      const c = await Category.findOne({ category_name: req.body.category });
      if (c) { book.category_id = c._id; book.category = c.category_name; }
      else book.category = req.body.category;
    }
    await book.save();
    res.json({ success: true, message: 'Book updated', book });
  } catch (e) { next(e); }
});

// DELETE /api/books/:id (owner only)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not your listing' });
    await book.deleteOne();
    res.json({ success: true, message: 'Book deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
