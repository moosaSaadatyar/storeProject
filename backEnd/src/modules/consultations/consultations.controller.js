const Consultation = require('./consultations.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { toPublicUrl } = require('../../middlewares/upload.middleware');
const { PHONE_REGEX, CONSULTATION_STATUSES } = require('../../config/constants');
const { deleteUploadedFile } = require('../../utils/helpers');

/**
 * POST /api/consultations (multipart — فیلد files)
 * ثبت عمومی درخواست مشاوره
 */
async function publicCreate(req, res, next) {
  try {
    const body = req.body;

    const phone = String(body.phone || '').trim();
    if (!body.fullName || !String(body.fullName).trim()) {
      return fail(res, 400, 'نام و نام‌خانوادگی الزامی است.', 'VALIDATION_ERROR');
    }
    if (!phone) {
      return fail(res, 400, 'شماره تماس الزامی است.', 'VALIDATION_ERROR');
    }
    if (!PHONE_REGEX.test(phone)) {
      return fail(res, 400, 'شماره موبایل به درستی وارد نشده است (مثال: 09121234567).', 'VALIDATION_ERROR');
    }

    const files = (Array.isArray(req.files) ? req.files : []).map((f) => toPublicUrl(f.path));

    const consultation = await Consultation.create({
      fullName: String(body.fullName).trim(),
      phone,
      serviceType: String(body.serviceType || '').trim(),
      cabinetType: String(body.cabinetType || '').trim(),
      style: String(body.style || '').trim(),
      color: String(body.color || '').trim(),
      dimensions: String(body.dimensions || '').trim(),
      city: String(body.city || '').trim(),
      budget: String(body.budget || '').trim(),
      description: String(body.description || '').trim(),
      files,
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      message: 'درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.',
      data: { id: consultation._id },
    });
  } catch (err) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => deleteUploadedFile(toPublicUrl(f.path)));
    }
    return next(err);
  }
}

/**
 * GET /api/admin/consultations?status=
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 10);
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);

    const [items, total] = await Promise.all([
      Consultation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Consultation.countDocuments(filter),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/consultations/:id
 */
async function adminGetById(req, res, next) {
  try {
    const consultation = await Consultation.findById(req.params.id).lean();
    if (!consultation) {
      return fail(res, 404, 'درخواست یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, consultation);
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/consultations/:id/status
 * بدنه: { status, adminNote }
 */
async function adminUpdateStatus(req, res, next) {
  try {
    const { status, adminNote } = req.body;
    if (!status || !CONSULTATION_STATUSES.includes(status)) {
      return fail(res, 400, 'وضعیت نامعتبر است.', 'VALIDATION_ERROR');
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return fail(res, 404, 'درخواست یافت نشد.', 'NOT_FOUND');
    }

    consultation.status = status;
    if (adminNote !== undefined) consultation.adminNote = String(adminNote).trim();
    const saved = await consultation.save();

    return ok(res, saved, 'وضعیت درخواست به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/consultations/:id
 */
async function adminDelete(req, res, next) {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return fail(res, 404, 'درخواست یافت نشد.', 'NOT_FOUND');
    }
    (consultation.files || []).forEach((url) => deleteUploadedFile(url));
    return ok(res, null, 'درخواست حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicCreate, adminList, adminGetById, adminUpdateStatus, adminDelete };
