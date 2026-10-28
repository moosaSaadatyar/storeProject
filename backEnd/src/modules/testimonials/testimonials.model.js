const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, trim: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    projectType: { type: String, trim: true },
    isApproved: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
