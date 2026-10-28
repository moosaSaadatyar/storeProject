const Faq = require('./faqs.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { toBoolean } = require('../../utils/helpers');

/**
 * GET /api/faqs — سوالات فعال
 */
async function publicList(req, res, next) {
  try {
    const items = await Faq.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return ok(res, items);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/faqs
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 50);
    const [items, total] = await Promise.all([
      Faq.find().sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit).lean(),
      Faq.countDocuments(),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/faqs
 */
async function adminCreate(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.question || !String(body.question).trim()) {
      return fail(res, 400, 'سؤال الزامی است.', 'VALIDATION_ERROR');
    }
    if (!body.answer || !String(body.answer).trim()) {
      return fail(res, 400, 'پاسخ الزامی است.', 'VALIDATION_ERROR');
    }

    const faq = await Faq.create({
      question: String(body.question).trim(),
      answer: String(body.answer).trim(),
      sortOrder: body.sortOrder !== undefined && body.sortOrder !== '' ? Number(body.sortOrder) : 0,
      isActive: toBoolean(body.isActive, true),
    });

    return res.status(201).json({ success: true, message: 'سؤال ایجاد شد.', data: faq });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/faqs/:id
 */
async function adminUpdate(req, res, next) {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return fail(res, 404, 'سؤال یافت نشد.', 'NOT_FOUND');
    }

    const body = req.body || {};
    if (body.question !== undefined) faq.question = String(body.question).trim();
    if (body.answer !== undefined) faq.answer = String(body.answer).trim();
    if (body.sortOrder !== undefined && body.sortOrder !== '') faq.sortOrder = Number(body.sortOrder);
    if (body.isActive !== undefined) faq.isActive = toBoolean(body.isActive);

    const saved = await faq.save();
    return ok(res, saved, 'سؤال به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/faqs/:id
 */
async function adminDelete(req, res, next) {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return fail(res, 404, 'سؤال یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, null, 'سؤال حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicList, adminList, adminCreate, adminUpdate, adminDelete };
