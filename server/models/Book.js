const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title required'], trim: true },
    author: { type: String, required: [true, 'Author required'], trim: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    // denormalised category name for fast search/display (kept in sync on save)
    category: { type: String, default: '', trim: true },
    price: { type: Number, required: [true, 'Price required'], min: 0 },
    condition: {
      type: String, required: true,
      enum: ['New', 'Like New', 'Good', 'Acceptable', 'Old'],
      default: 'Good'
    },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    image_url: { type: String, default: '' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Exchanged', 'Removed'],
      default: 'Available'
    },
    listing_type: { type: String, enum: ['Sell', 'Exchange', 'Both'], default: 'Both' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

bookSchema.index({ title: 'text', author: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
