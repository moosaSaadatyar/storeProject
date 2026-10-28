const { verifyToken } = require('../utils/jwt');

/**
 * میانی‌اف احراز هویت مدیر — برای همه روت‌های /api/admin (به‌جز /login)
 * در صورت موفقیت، req.admin = { id, email } قرار می‌گیرد.
 */
module.exports = function verifyAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'توکن احراز هویت یافت نشد.',
      code: 'UNAUTHORIZED',
    });
  }

  try {
    const payload = verifyToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر یا منقضی شده است.',
      code: 'UNAUTHORIZED',
    });
  }
};
