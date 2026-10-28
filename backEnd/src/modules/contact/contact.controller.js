const ContactMessage = require('./contact.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { PHONE_REGEX, CONTACT_STATUSES } = require('../../config/constants');

/**
 * POST /api/contact
 * ثبت عمومی پیام تماس
 */
async function publicCreate(req, res, next) {
  try {
    const body = req.body || {};

    if (!body.fullName || !String(body.fullName).trim()) {
      return fail(res, 400, 'نام و نام‌خانوادگی الزامی است.', 'VALIDATION_ERROR');
    }

    const phone = String(body.phone || '').trim();
    if (!phone) {
      return fail(res, 400, 'شماره تماس الزامی است.', 'VALIDATION_ERROR');
    }
    if (!PHONE_REGEX.test(phone)) {
      return fail(res, 400, 'شماره موبایل به درستی وارد نشده است (مثال: 09121234567).', 'VALIDATION_ERROR');
    }

    if (!body.message || !String(body.message).trim()) {
      return fail(res, 400, 'متن پیام الزامی است.', 'VALIDATION_ERROR');
    }

    const contact = await ContactMessage.create({
      fullName: String(body.fullName).trim(),
      phone,
      email: String(body.email || '').trim(),
      subject: String(body.subject || '').trim(),
      message: String(body.message).trim(),
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.',
      data: { id: contact._id },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/contact
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 10);
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(filter),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/contact/:id/status
 * بدنه: { status: 'new' | 'answered' }
 */
async function adminUpdateStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status || !CONTACT_STATUSES.includes(status)) {
      return fail(res, 400, 'وضعیت نامعتبر است.', 'VALIDATION_ERROR');
    }

    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) {
      return fail(res, 404, 'پیام یافت نشد.', 'NOT_FOUND');
    }

    contact.status = status;
    const saved = await contact.save();
    return ok(res, saved, 'وضعیت پیام به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/contact/:id
 */
async function adminDelete(req, res, next) {
  try {
    const contact = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!contact) {
      return fail(res, 404, 'پیام یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, null, 'پیام حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicCreate, adminList, adminUpdateStatus, adminDelete };
