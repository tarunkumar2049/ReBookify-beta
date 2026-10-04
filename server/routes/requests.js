const express = require('express');
const ExchangeRequest = require('../models/Request');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/requests — send exchange/buy request
router.post('/', protect, async (req, res, next) => {
  try {
    const { book_id, message, offer } = req.body;
    if (!book_id) return res.status(400).json({ success: false, message: 'book_id required' });
    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.user_id.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'You cannot request your own book' });
    if (book.status !== 'Available')
      return res.status(400).json({ success: false, message: 'Book is not available' });
    const dup = await ExchangeRequest.findOne({ book_id, requester_id: req.user._id, status: 'Pending' });
    if (dup) return res.status(409).json({ success: false, message: 'You already have a pending request for this book' });
    const r = await ExchangeRequest.create({
      book_id, requester_id: req.user._id, owner_id: book.user_id, message: message || '', offer: offer || ''
    });
    res.status(201).json({ success: true, message: 'Request sent', request: r });
  } catch (e) { next(e); }
});

// GET /api/requests?type=sent|received|all
router.get('/', protect, async (req, res, next) => {
  try {
    const { type = 'all', status } = req.query;
    const filter = {};
    if (type === 'sent') filter.requester_id = req.user._id;
    else if (type === 'received') filter.owner_id = req.user._id;
    else filter.$or = [{ requester_id: req.user._id }, { owner_id: req.user._id }];
    if (status) filter.status = status;
    const requests = await ExchangeRequest.find(filter)
      .populate('book_id', 'title author price image_url status')
      .populate('requester_id', 'name email')
      .populate('owner_id', 'name email')
      .sort({ created_at: -1 });
    res.json({ success: true, requests });
  } catch (e) { next(e); }
});

// PUT /api/requests/:id — accept / reject / complete / cancel
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { status } = req.body; // Accepted | Rejected | Completed | Cancelled
    if (!['Accepted', 'Rejected', 'Completed', 'Cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const r = await ExchangeRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Request not found' });
    const isOwner = r.owner_id.toString() === req.user._id.toString();
    const isRequester = r.requester_id.toString() === req.user._id.toString();
    if (['Accepted', 'Rejected'].includes(status) && !isOwner)
      return res.status(403).json({ success: false, message: 'Only the owner can accept/reject' });
    if (['Completed', 'Cancelled'].includes(status) && !(isOwner || isRequester))
      return res.status(403).json({ success: false, message: 'Not authorized' });
    r.status = status;
    await r.save();
    const book = await Book.findById(r.book_id);
    if (book) {
      if (status === 'Accepted') book.status = 'Requested';
      if (status === 'Completed') {
        book.status = 'Exchanged';
        await Transaction.create({
          buyer_id: r.requester_id, seller_id: r.owner_id,
          book_id: r.book_id, request_id: r._id, status: 'Completed'
        });
      }
      if (status === 'Rejected' || status === 'Cancelled') {
        // if no other accepted/pending requests, revert to Available
        const other = await ExchangeRequest.findOne({ book_id: book._id, status: { $in: ['Accepted', 'Pending'] }, _id: { $ne: r._id } });
        if (!other) book.status = 'Available';
        if (status === 'Cancelled') {
          await Transaction.create({
            buyer_id: r.requester_id, seller_id: r.owner_id,
            book_id: r.book_id, request_id: r._id, status: 'Cancelled'
          });
        }
      }
      await book.save();
    }
    const msg = { Accepted: 'Request accepted', Rejected: 'Request rejected', Completed: 'Transaction completed', Cancelled: 'Request cancelled' }[status];
    res.json({ success: true, message: msg, request: r });
  } catch (e) { next(e); }
});

module.exports = router;
