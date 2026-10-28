const CabinetService = require('./services.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { toPublicUrl } = require('../../middlewares/upload.middleware');
const { safeJsonArray, toBoolean, deleteUploadedFile } = require('../../utils/helpers');

/**
 * GET /api/services — خدمات فعال
 */
async function publicList(req, res, next) {
  try {
    const items = await CabinetService.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return ok(res, items);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/services
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 50);
    const [items, total] = await Promise.all([
      CabinetService.find().sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit).lean(),
      CabinetService.countDocuments(),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

function parseFeatures(value) {
  return safeJsonArray(value, 30);
}

/**
 * POST /api/admin/services (multipart — فایل image)
 */
async function adminCreate(req, res, next) {
  try {
    const body = req.body;
    if (!body.title || !String(body.title).trim()) {
      return fail(res, 400, 'عنوان خدمت الزامی است.', 'VALIDATION_ERROR');
    }

    const imageFile = Array.isArray(req.files) && req.files[0] ? toPublicUrl(req.files[0].path) : null;

    const service = await CabinetService.create({
      title: String(body.title).trim(),
      description: String(body.description || '').trim(),
      details: String(body.details || '').trim(),
      image: imageFile,
      features: parseFeatures(body.features),
      sortOrder: body.sortOrder !== undefined && body.sortOrder !== '' ? Number(body.sortOrder) : 0,
      isActive: toBoolean(body.isActive, true),
    });

    return res.status(201).json({ success: true, message: 'خدمت ایجاد شد.', data: service });
  } catch (err) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => deleteUploadedFile(toPublicUrl(f.path)));
    }
    return next(err);
  }
}

/**
 * PUT /api/admin/services/:id (multipart)
 */
async function adminUpdate(req, res, next) {
  try {
    const service = await CabinetService.findById(req.params.id);
    if (!service) {
      return fail(res, 404, 'خدمت یافت نشد.', 'NOT_FOUND');
    }

    const body = req.body;
    if (body.title !== undefined) service.title = String(body.title).trim();
    if (body.description !== undefined) service.description = String(body.description).trim();
    if (body.details !== undefined) service.details = String(body.details).trim();
    if (body.features !== undefined) service.features = parseFeatures(body.features);
    if (body.sortOrder !== undefined && body.sortOrder !== '') service.sortOrder = Number(body.sortOrder);
    if (body.isActive !== undefined) service.isActive = toBoolean(body.isActive);

    const imageFile = Array.isArray(req.files) && req.files[0] ? toPublicUrl(req.files[0].path) : null;
    if (imageFile) {
      deleteUploadedFile(service.image);
      service.image = imageFile;
    }

    const saved = await service.save();
    return ok(res, saved, 'خدمت به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/services/:id
 */
async function adminDelete(req, res, next) {
  try {
    const service = await CabinetService.findByIdAndDelete(req.params.id);
    if (!service) {
      return fail(res, 404, 'خدمت یافت نشد.', 'NOT_FOUND');
    }
    deleteUploadedFile(service.image);
    return ok(res, null, 'خدمت حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicList, adminList, adminCreate, adminUpdate, adminDelete };
