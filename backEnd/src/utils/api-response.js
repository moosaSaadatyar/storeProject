/**
 * پاسخ‌های استاندارد API — شکل یکپارچه برای همه endpointها:
 * { success: boolean, message?: string, data?: any, code?: string }
 */

function ok(res, data = null, message = 'OK') {
  return res.json({ success: true, message, data });
}

function fail(res, status, message, code = 'ERROR') {
  return res.status(status).json({ success: false, message, code });
}

/**
 * ساخت داده‌ی صفحه‌بندی‌شده
 */
function paginationMeta(items, total, page, limit) {
  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * خواندن page/limit از query string با مقدارهای پیش‌فرض و محدودیت
 */
function parsePaging(query, maxLimit = 100, defaultLimit = 12) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { ok, fail, paginationMeta, parsePaging };
