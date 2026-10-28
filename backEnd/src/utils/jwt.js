const jwt = require('jsonwebtoken');

/**
 * تولید توکن JWT برای مدیر
 */
function signToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );
}

/**
 * بررسی اعتبار توکن — در صورت نامعتبر بودن خطا پرتاب می‌کند
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
