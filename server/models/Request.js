const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: '', maxlength: 1000 },
    offer: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Request', requestSchema);
