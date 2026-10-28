const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt hash — هرگز در پاسخ‌های API نمایش داده نمی‌شود
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/** خروجی ایمن بدون فیلد رمز عبور */
adminSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Admin', adminSchema);
