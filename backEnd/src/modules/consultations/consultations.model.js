const mongoose = require('mongoose');
const { CONSULTATION_STATUSES } = require('../../config/constants');

const consultationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    serviceType: { type: String, trim: true },
    cabinetType: { type: String, trim: true },
    style: { type: String, trim: true },
    color: { type: String, trim: true },
    dimensions: { type: String, trim: true }, // ابعاد/متراژ تقریبی
    city: { type: String, trim: true },
    budget: { type: String, trim: true }, // بازه (اختیاری)
    description: { type: String },
    files: [{ type: String }], // تصاویر آپلودشده
    status: { type: String, enum: CONSULTATION_STATUSES, default: 'new' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
