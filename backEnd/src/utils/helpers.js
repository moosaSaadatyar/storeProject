const fs = require('fs');
const path = require('path');
const { UPLOADS_ROOT } = require('../middlewares/upload.middleware');

/**
 * ساخت slug لاتین از متن — اگر نتیجه خالی بود (متن فارسی) از شناسه استفاده می‌شود.
 */
function slugify(text, fallback) {
  const slug = String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || (fallback ? `c-${fallback}` : '');
}

/**
 * خواندن ایمن آرایه JSON از فیلد فرم (در صورت خطا، آرایه خالی).
 */
function safeJsonArray(value, maxLength = 50) {
  if (value === undefined || value === null || value === '') return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, maxLength);
  } catch {
    return [];
  }
}

/**
 * خواندن ایمن JSON عمومی (شیء یا آرایه).
 */
function safeJson(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * تبدیل مقدار فرم به بولین
 */
function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  return value === true || value === 'true' || value === '1';
}

/**
 * حذف فایل آپلودشده از دیسک — url به شکل /uploads/... است.
 * خطاها نادیده گرفته می‌شوند (حذف اسناد مهم‌تر است).
 */
function deleteUploadedFile(url) {
  if (!url || typeof url !== 'string') return;
  if (!url.startsWith('/uploads/')) return;

  const absolute = path.join(UPLOADS_ROOT, url.replace('/uploads/', '').split('/').join(path.sep));
  // اطمینان از آنکه مسیر داخل uploads است
  if (!absolute.startsWith(UPLOADS_ROOT)) return;

  fs.unlink(absolute, () => {
    /* noop — حذف اختیاری */
  });
}

module.exports = { slugify, safeJsonArray, safeJson, toBoolean, deleteUploadedFile };
