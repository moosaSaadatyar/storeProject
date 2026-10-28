const mongoose = require('mongoose');
const { CONTACT_STATUSES } = require('../../config/constants');

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: CONTACT_STATUSES, default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
