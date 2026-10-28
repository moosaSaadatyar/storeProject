const mongoose = require('mongoose');

const whyUsItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    longText: { type: String },
    experienceYears: { type: Number },
    strengths: [{ type: String }],
    values: [{ type: String }],
  },
  { _id: false }
);

const homeSchema = new mongoose.Schema(
  {
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    heroDescription: { type: String },
    heroImage: { type: String },
    whyUs: [whyUsItemSchema],
    steps: [stepSchema],
  },
  { _id: false }
);

/**
 * سند تک‌مرحله‌ای تنظیمات سایت — همیشه با _id = 'singleton'
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String },
    siteName: { type: String, trim: true },
    logo: { type: String },
    shortDescription: { type: String },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    mapLink: { type: String, trim: true },
    workHours: { type: String, trim: true },
    instagram: { type: String, trim: true },
    telegram: { type: String, trim: true },
    about: { type: aboutSchema },
    home: { type: homeSchema },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
