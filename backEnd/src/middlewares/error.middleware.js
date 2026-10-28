const multer = require('multer');

/**
 * پاسخ 404 برای مسیرهای ناموجود API
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'منبع موردنظر یافت نشد.',
    code: 'NOT_FOUND',
  });
}

/**
 * مدیریت خطای متمرکز — همه خطاها به شکل استاندارد پاسخ داده می‌شوند
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // خطاهای آپلود فایل (multer)
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'حجم فایل از حد مجاز بیشتر است.'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'تعداد فایل‌ها از حد مجاز بیشتر است.'
          : 'در آپلود فایل مشکلی پیش آمده است.';
    return res.status(400).json({ success: false, message, code: 'UPLOAD_ERROR' });
  }

  // خطای فیلتر فرمت فایل (خطای سفارشی multer)
  if (err.message && String(err.message).includes('فقط تصاویر')) {
    return res.status(400).json({ success: false, message: err.message, code: 'UPLOAD_ERROR' });
  }

  // خطاهای اعتبارسنجی Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(' '), code: 'VALIDATION_ERROR' });
  }

  // شناسه نامعتبر
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'شناسه ارسال‌شده معتبر نیست.', code: 'INVALID_ID' });
  }

  // 404های داخلی (مثلاً فایل استاتیک یافت نشد)
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({ success: false, message: 'منبع موردنظر یافت نشد.', code: 'NOT_FOUND' });
  }

  // مقدار تکراری در فیلد یونیک
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'مقدار تکراری برای فیلد یونیک ارسال شده است.', code: 'DUPLICATE' });
  }

  // بدنه‌ی JSON نامعتبر
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'بدنه‌ی درخواست به‌صورت JSON معتبر نیست.', code: 'BAD_JSON' });
  }

  console.error('[error]', err);
  return res.status(500).json({
    success: false,
    message: 'خطای داخلی سرور رخ داده است.',
    code: 'SERVER_ERROR',
  });
}

module.exports = { notFoundHandler, errorHandler };
