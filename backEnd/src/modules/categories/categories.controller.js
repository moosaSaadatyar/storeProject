const Category = require('./categories.model');
const Project = require('../projects/project.model');
const { ok, fail, parsePaging, paginationMeta } = require('../../utils/api-response');
const { toPublicUrl } = require('../../middlewares/upload.middleware');
const { slugify, toBoolean, deleteUploadedFile } = require('../../utils/helpers');

/**
 * GET /api/categories — دسته‌های فعال + تعداد پروژه
 */
async function publicList(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();

    const ids = categories.map((c) => c._id);
    const counts = await Project.aggregate([
      { $match: { category: { $in: ids }, isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    const data = categories.map((c) => ({ ...c, projectCount: countMap[String(c._id)] || 0 }));
    return ok(res, data);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/categories
 */
async function adminList(req, res, next) {
  try {
    const { page, limit, skip } = parsePaging(req.query, 100, 50);
    const [items, total] = await Promise.all([
      Category.find().sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(),
    ]);
    return ok(res, paginationMeta(items, total, page, limit));
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/categories (multipart — فایل image)
 */
async function adminCreate(req, res, next) {
  try {
    const body = req.body;
    if (!body.name || !String(body.name).trim()) {
      return fail(res, 400, 'نام دسته‌بندی الزامی است.', 'VALIDATION_ERROR');
    }

    const imageFile = Array.isArray(req.files) && req.files[0] ? toPublicUrl(req.files[0].path) : null;

    const category = new Category({
      name: String(body.name).trim(),
      slug: String(body.slug || '').trim().toLowerCase() || undefined,
      description: String(body.description || '').trim(),
      image: imageFile,
      icon: String(body.icon || '').trim(),
      sortOrder: body.sortOrder !== undefined && body.sortOrder !== '' ? Number(body.sortOrder) : 0,
      isActive: toBoolean(body.isActive, true),
    });

    // اگر slug خالی بود (مثلاً نام فارسی) از شناسه سند استفاده می‌شود
    if (!category.slug) {
      category.slug = slugify(category.name, String(category._id).slice(-8));
    }

    const saved = await category.save();
    return res.status(201).json({ success: true, message: 'دسته‌بندی ایجاد شد.', data: saved });
  } catch (err) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => deleteUploadedFile(toPublicUrl(f.path)));
    }
    return next(err);
  }
}

/**
 * PUT /api/admin/categories/:id (multipart)
 */
async function adminUpdate(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return fail(res, 404, 'دسته‌بندی یافت نشد.', 'NOT_FOUND');
    }

    const body = req.body;
    if (body.name !== undefined) category.name = String(body.name).trim();
    if (body.slug !== undefined && body.slug.trim()) category.slug = String(body.slug).trim().toLowerCase();
    if (body.description !== undefined) category.description = String(body.description).trim();
    if (body.icon !== undefined) category.icon = String(body.icon).trim();
    if (body.sortOrder !== undefined && body.sortOrder !== '') category.sortOrder = Number(body.sortOrder);
    if (body.isActive !== undefined) category.isActive = toBoolean(body.isActive);

    const imageFile = Array.isArray(req.files) && req.files[0] ? toPublicUrl(req.files[0].path) : null;
    if (imageFile) {
      deleteUploadedFile(category.image);
      category.image = imageFile;
    }

    const saved = await category.save();
    return ok(res, saved, 'دسته‌بندی به‌روزرسانی شد.');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id
 */
async function adminDelete(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return fail(res, 404, 'دسته‌بندی یافت نشد.', 'NOT_FOUND');
    }

    const projectCount = await Project.countDocuments({ category: category._id });
    if (projectCount > 0) {
      return fail(res, 409, `این دسته‌بندی ${projectCount} پروژه دارد و قابل حذف نیست. ابتدا پروژه‌ها را جابه‌جا کنید.`, 'IN_USE');
    }

    await category.deleteOne();
    deleteUploadedFile(category.image);
    return ok(res, null, 'دسته‌بندی حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicList, adminList, adminCreate, adminUpdate, adminDelete };
