const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    details: { type: String },
    image: { type: String }, // /uploads/...
    features: [{ type: String, trim: true }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CabinetService', serviceSchema);
