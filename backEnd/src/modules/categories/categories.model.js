const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String }, // /uploads/...
    icon: { type: String }, // نام آیکون (مثلاً fa-solid fa-kitchen-set)
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
