const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    status: { type: String, enum: ['Completed', 'Cancelled'], default: 'Completed' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Transaction', transactionSchema);
