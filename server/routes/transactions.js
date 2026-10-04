const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions?status=&book=&from=&to=
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, book, from, to } = req.query;
    const filter = { $or: [{ buyer_id: req.user._id }, { seller_id: req.user._id }] };
    if (req.user.role === 'admin' && req.query.all === 'true') delete filter.$or;
    if (status) filter.status = status;
    if (book) filter.book_id = book;
    if (from || to) {
      filter.created_at = {};
      if (from) filter.created_at.$gte = new Date(from);
      if (to) filter.created_at.$lte = new Date(to);
    }
    const txns = await Transaction.find(filter)
      .populate('book_id', 'title author price image_url')
      .populate('buyer_id', 'name email')
      .populate('seller_id', 'name email')
      .populate('request_id', 'status message')
      .sort({ created_at: -1 });
    res.json({ success: true, transactions: txns });
  } catch (e) { next(e); }
});

module.exports = router;
