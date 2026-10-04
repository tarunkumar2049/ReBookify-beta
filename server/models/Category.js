const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: [true, 'Category name required'], unique: true, trim: true },
    description: { type: String, default: '', trim: true },
    icon: { type: String, default: '📚' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Category', categorySchema);
