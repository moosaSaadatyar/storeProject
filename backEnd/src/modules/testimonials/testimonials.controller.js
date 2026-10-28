const Testimonial = require('./testimonials.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { toBoolean } = require('../../utils/helpers');

/**
 * GET /api/testimonials — فقط موارد تأییدشده
 */
async function publicList(req, res, next) {
  try {
    const items = await Testimonial.find({ isApproved: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(res, items);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/testimonials — ثبت نظر عمومی (isApproved=false)
 */
async function publicCreate(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.comment || !String(body.comment).trim()) {
      return fail(res, 400, 'متن نظر الزامی است.', 'VALIDATION_ERROR');
    }

    const rating = body.rating !== undefined && body.rating !== '' ? Number(body.rating) : undefined;
    if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
      return fail(res, 400, 'امتیاز باید عددی بین ۱ تا ۵ باشد.', 'VALIDATION_ERROR');
    }

    const testimonial = await Testimonial.create({
      customerName: String(body.customerName || '').trim(),
      comment: String(body.comment).trim(),
      rating,
      projectType: String(body.projectType || '').trim(),
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message: 'نظر شما ثبت شد. پس از تأیید مدیریت نمایش داده می‌شود.',
      data: { id: testimonial._id },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/testimonials
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 10);
    const filter = {};
    if (req.query.isApproved !== undefined && req.query.isApproved !== '') {
      filter.isApproved = req.query.isApproved === 'true';
    }

    const [items, total] = await Promise.all([
      Testimonial.find(filter).sort({ isApproved: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(filter),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/testimonials — ایجاد مستقیم توسط مدیر
 */
async function adminCreate(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.comment || !String(body.comment).trim()) {
      return fail(res, 400, 'متن نظر الزامی است.', 'VALIDATION_ERROR');
    }
    const testimonial = await Testimonial.create({
      customerName: String(body.customerName || '').trim(),
      comment: String(body.comment).trim(),
      rating: body.rating ? Number(body.rating) : undefined,
      projectType: String(body.projectType || '').trim(),
      isApproved: toBoolean(body.isApproved, true),
      sortOrder: body.sortOrder !== undefined && body.sortOrder !== '' ? Number(body.sortOrder) : 0,
    });
    return res.status(201).json({ success: true, message: 'نظر ایجاد شد.', data: testimonial });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/testimonials/:id
 */
async function adminUpdate(req, res, next) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return fail(res, 404, 'نظر یافت نشد.', 'NOT_FOUND');
    }

    const body = req.body || {};
    if (body.customerName !== undefined) testimonial.customerName = String(body.customerName).trim();
    if (body.comment !== undefined) testimonial.comment = String(body.comment).trim();
    if (body.rating !== undefined) testimonial.rating = body.rating ? Number(body.rating) : undefined;
    if (body.projectType !== undefined) testimonial.projectType = String(body.projectType).trim();
    if (body.isApproved !== undefined) testimonial.isApproved = toBoolean(body.isApproved);
    if (body.sortOrder !== undefined && body.sortOrder !== '') testimonial.sortOrder = Number(body.sortOrder);

    const saved = await testimonial.save();
    return ok(res, saved, 'نظر به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/testimonials/:id/approve
 * بدنه: { isApproved: true|false } — مقدار پیش‌فرض true
 */
async function adminApprove(req, res, next) {
  try {
    const { isApproved } = req.body || {};
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return fail(res, 404, 'نظر یافت نشد.', 'NOT_FOUND');
    }
    testimonial.isApproved = toBoolean(isApproved, true);
    const saved = await testimonial.save();
    return ok(res, saved, saved.isApproved ? 'نظر تأیید شد.' : 'نظر رد شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/testimonials/:id
 */
async function adminDelete(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return fail(res, 404, 'نظر یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, null, 'نظر حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  publicList,
  publicCreate,
  adminList,
  adminCreate,
  adminUpdate,
  adminApprove,
  adminDelete,
};
