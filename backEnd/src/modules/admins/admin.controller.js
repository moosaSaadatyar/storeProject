const bcrypt = require('bcryptjs');
const Admin = require('./admin.model');
const { signToken } = require('../../utils/jwt');
const { ok, fail } = require('../../utils/api-response');

/**
 * POST /api/admin/login
 * ورود مدیر → { token, admin: { id, name, email } }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) {
      return fail(res, 401, 'ایمیل یا رمز عبور اشتباه است.', 'INVALID_CREDENTIALS');
    }

    const matched = await bcrypt.compare(String(password), admin.password);
    if (!matched) {
      return fail(res, 401, 'ایمیل یا رمز عبور اشتباه است.', 'INVALID_CREDENTIALS');
    }

    if (!admin.isActive) {
      return fail(res, 403, 'حساب مدیر غیرفعال است. با مدیر سیستم تماس بگیرید.', 'ACCOUNT_DISABLED');
    }

    const token = signToken(admin);
    return ok(res, {
      token,
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email },
    }, 'ورود با موفقیت انجام شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/me
 * اطلاعات مدیر صاحب توکن
 */
async function me(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !admin.isActive) {
      return fail(res, 401, 'حساب مدیر یافت نشد یا غیرفعال است.', 'UNAUTHORIZED');
    }
    return ok(res, { id: admin._id.toString(), name: admin.name, email: admin.email });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, me };
