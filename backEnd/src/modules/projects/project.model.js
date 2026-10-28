const mongoose = require('mongoose');
const { PROJECT_STYLES, PROJECT_SPACES } = require('../../config/constants');

const areaSchema = new mongoose.Schema(
  {
    value: Number,
    unit: { type: String, default: 'متر مربع' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String },
    coverImage: { type: String, required: true }, // مسیر /uploads/... یا url کامل
    images: [{ type: String }], // گالری
    beforeImage: { type: String },
    afterImage: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    style: { type: String, enum: [...PROJECT_STYLES, null] },
    space: { type: String, enum: [...PROJECT_SPACES, null] },
    bodyMaterial: { type: String, trim: true },
    doorMaterial: { type: String, trim: true },
    countertop: { type: String, trim: true },
    hardware: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    area: { type: areaSchema },
    duration: { type: String, trim: true },
    location: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// شاخص برای فیلترهای پورتفولیو
projectSchema.index({ category: 1, style: 1, space: 1 });
projectSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
