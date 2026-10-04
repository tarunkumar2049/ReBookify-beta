const express = require('express');
const Category = require('../models/Category');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories (public, with counts)
router.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ category_name: 1 });
    const counts = await Book.aggregate([
      { $match: { status: 'Available' } },
      { $group: { _id: '$category_id', count: { $sum: 1 } } }
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    res.json({
      success: true,
      categories: cats.map((c) => ({ ...c.toObject(), bookCount: map[String(c._id)] || 0 }))
    });
  } catch (e) { next(e); }
});

// POST /api/categories (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { category_name, description, icon } = req.body;
    if (!category_name) return res.status(400).json({ success: false, message: 'Category name required' });
    const cat = await Category.create({ category_name, description: description || '', icon: icon || '📚' });
    res.status(201).json({ success: true, message: 'Category added', category: cat });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ success: false, message: 'Category already exists' });
    next(e);
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category updated', category: cat });
  } catch (e) { next(e); }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const inUse = await Book.countDocuments({ category_id: req.params.id });
    if (inUse > 0) return res.status(400).json({ success: false, message: `Category in use by ${inUse} book(s)` });
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
