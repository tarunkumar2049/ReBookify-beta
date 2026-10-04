const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Category = require('../models/Category');
const ExchangeRequest = require('../models/Request');
const Transaction = require('../models/Transaction');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, totalBooks, availableBooks, pendingRequests, completedTxns, totalCategories] = await Promise.all([
      User.countDocuments(), Book.countDocuments(),
      Book.countDocuments({ status: 'Available' }),
      ExchangeRequest.countDocuments({ status: 'Pending' }),
      Transaction.countDocuments({ status: 'Completed' }),
      Category.countDocuments()
    ]);
    const last30 = new Date(); last30.setDate(last30.getDate() - 30);
    const [newUsers, newListings, txns] = await Promise.all([
      User.aggregate([
        { $match: { created_at: { $gte: last30 } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Book.aggregate([
        { $match: { created_at: { $gte: last30 } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Transaction.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    res.json({
      success: true, stats: { totalUsers, totalBooks, availableBooks, pendingRequests, completedTxns, totalCategories },
      charts: { newUsers, newListings, txns }
    });
  } catch (e) { next(e); }
});

// GET /api/admin/users?q=
router.get('/users', async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] } : {};
    const users = await User.find(filter).sort({ created_at: -1 }).limit(200);
    res.json({ success: true, users: users.map((u) => u.toSafeJSON()) });
  } catch (e) { next(e); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await Book.deleteMany({ user_id: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User and their listings removed' });
  } catch (e) { next(e); }
});

// GET /api/admin/books?q=&status=&page=
router.get('/books', async (req, res, next) => {
  try {
    const { q, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }];
    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter).populate('user_id', 'name email').populate('category_id', 'category_name').sort({ created_at: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, books });
  } catch (e) { next(e); }
});

// DELETE /api/admin/books/:id
router.delete('/books/:id', async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Listing removed' });
  } catch (e) { next(e); }
});

// GET /api/admin/requests?status=
router.get('/requests', async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const requests = await ExchangeRequest.find(filter)
      .populate('book_id', 'title author').populate('requester_id', 'name email').populate('owner_id', 'name email')
      .sort({ created_at: -1 }).limit(200);
    res.json({ success: true, requests });
  } catch (e) { next(e); }
});

// GET /api/admin/transactions
router.get('/transactions', async (req, res, next) => {
  try {
    const txns = await Transaction.find()
      .populate('book_id', 'title').populate('buyer_id', 'name email').populate('seller_id', 'name email')
      .sort({ created_at: -1 }).limit(200);
    res.json({ success: true, transactions: txns });
  } catch (e) { next(e); }
});

module.exports = router;
