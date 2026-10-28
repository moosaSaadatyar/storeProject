const { PHONE_REGEX } = require('../config/constants');

/**
 * اعتبارسنجی فیلدهای الزامی در body
 * @param {string[]} fields نام فیلدهای الزامی
 */
function requiredFields(fields) {
  return (req, res, next) => {
    const errors = [];
    for (const field of fields) {
      const value = req.body ? req.body[field] : undefined;
      if (value === undefined || value === null || String(value).trim() === '') {
        errors.push(`فیلد «${field}» الزامی است.`);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ارسالی معتبر نیست.',
        code: 'VALIDATION_ERROR',
        errors,
      });
    }
    next();
  };
}

/**
 * اعتبارسنجی فرمت شماره موبایل (09xxxxxxxxx)
 */
function validPhone(field = 'phone') {
  return (req, res, next) => {
    const value = req.body ? req.body[field] : undefined;
    if (value !== undefined && value !== null && value !== '' && !PHONE_REGEX.test(String(value).trim())) {
      return res.status(400).json({
        success: false,
        message: `شماره «${field}» به درستی وارد نشده است (مثال: 09121234567).`,
        code: 'VALIDATION_ERROR',
      });
    }
    next();
  };
}

/**
 * اعتبارسنجی طول حداکثری فیلدها
 */
function maxLengths(map) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, max] of Object.entries(map)) {
      const value = req.body ? req.body[field] : undefined;
      if (value !== undefined && value !== null && String(value).length > max) {
        errors.push(`فیلد «${field}» حداکثر ${max} کاراکتر می‌تواند باشد.`);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ارسالی معتبر نیست.',
        code: 'VALIDATION_ERROR',
        errors,
      });
    }
    next();
  };
}

module.exports = { requiredFields, validPhone, maxLengths };
