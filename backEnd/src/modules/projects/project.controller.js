const fs = require('fs');
const Project = require('./project.model');
const Category = require('../categories/categories.model');
const projectService = require('./project.service');
const { ok, fail } = require('../../utils/api-response');
const { toPublicUrl } = require('../../middlewares/upload.middleware');
const { toBoolean, deleteUploadedFile } = require('../../utils/helpers');

/**
 * خواندن فایل‌های آپلودشده از req (الگوی multer fields)
 * برگشتی: { cover: url|null, gallery: [urls], before: url|null, after: url|null }
 */
function collectUploadedFiles(req) {
  const result = { cover: null, gallery: [], before: null, after: null };
  const files = req.files || {};

  const cover = Array.isArray(files.coverImage) ? files.coverImage[0] : null;
  if (cover) result.cover = toPublicUrl(cover.path);

  if (Array.isArray(files.files)) {
    result.gallery = files.files.map((f) => toPublicUrl(f.path));
  }

  const before = Array.isArray(files.beforeImage) ? files.beforeImage[0] : null;
  if (before) result.before = toPublicUrl(before.path);

  const after = Array.isArray(files.afterImage) ? files.afterImage[0] : null;
  if (after) result.after = toPublicUrl(after.path);

  return result;
}

/**
 * پاک‌سازی فایل‌های موقت وقتی درخواست قبل از ذخیره خطا می‌دهد
 */
function cleanupFiles(req) {
  const files = req.files || {};
  const all = [...(files.coverImage || []), ...(files.files || []), ...(files.beforeImage || []), ...(files.afterImage || [])];
  for (const file of all) {
    fs.unlink(file.path, () => {
      /* noop */
    });
  }
}

/** بررسی موجود بودن دسته */
async function assertCategoryExists(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    const err = new Error('دسته‌بندی انتخاب‌شده یافت نشد.');
    err.status = 400;
    err.code = 'INVALID_CATEGORY';
    throw err;
  }
}

/* ============================ عمومی ============================ */

/**
 * GET /api/projects
 */
async function publicList(req, res, next) {
  try {
    const data = await projectService.getPublicList(req.query);
    return ok(res, data);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/projects/:id
 */
async function publicGetById(req, res, next) {
  try {
    const project = await projectService.getPublicById(req.params.id);
    if (!project) {
      return fail(res, 404, 'پروژه موردنظر یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, project);
  } catch (err) {
    return next(err);
  }
}

/* ============================ مدیریتی ============================ */

/**
 * GET /api/admin/projects
 */
async function adminList(req, res, next) {
  try {
    const data = await projectService.getAdminList(req.query);
    return ok(res, data);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/projects/:id
 */
async function adminGetById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).populate('category', 'name slug image');
    if (!project) {
      return fail(res, 404, 'پروژه موردنظر یافت نشد.', 'NOT_FOUND');
    }
    return ok(res, project);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/projects (multipart)
 */
async function adminCreate(req, res, next) {
  try {
    const files = collectUploadedFiles(req);
    const body = req.body;

    if (!body.title || !String(body.title).trim()) {
      cleanupFiles(req);
      return fail(res, 400, 'عنوان پروژه الزامی است.', 'VALIDATION_ERROR');
    }

    if (!body.category) {
      cleanupFiles(req);
      return fail(res, 400, 'دسته‌بندی پروژه الزامی است.', 'VALIDATION_ERROR');
    }

    await assertCategoryExists(body.category);

    // کاور: فایل جدید > پوشه‌ی گالری
    let coverImage = files.cover || body.coverImageUrl || null;
    const images = [...files.gallery];
    if (!coverImage && images.length > 0) {
      coverImage = images[0];
    }
    if (!coverImage) {
      cleanupFiles(req);
      return fail(res, 400, 'تصویر کاور پروژه الزامی است.', 'VALIDATION_ERROR');
    }

    const data = projectService.buildProjectData(body);
    data.coverImage = coverImage;
    data.images = images;
    if (files.before || body.beforeImageUrl) data.beforeImage = files.before || body.beforeImageUrl;
    if (files.after || body.afterImageUrl) data.afterImage = files.after || body.afterImageUrl;

    const project = await Project.create(data);
    const populated = await Project.findById(project._id).populate('category', 'name slug image');
    return res.status(201).json({ success: true, message: 'پروژه با موفقیت ایجاد شد.', data: populated });
  } catch (err) {
    cleanupFiles(req);
    return next(err);
  }
}

/**
 * PUT /api/admin/projects/:id (multipart — فیلد imageAction: add | replace)
 */
async function adminUpdate(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return fail(res, 404, 'پروژه موردنظر یافت نشد.', 'NOT_FOUND');
    }

    const files = collectUploadedFiles(req);
    const body = req.body;

    const currentCategoryId = project.category && project.category._id
      ? project.category._id.toString()
      : String(project.category || '');
    if (body.category && String(body.category) !== currentCategoryId) {
      await assertCategoryExists(body.category);
    }

    const replaceImages = toBoolean(body.imageAction === 'replace' || body.replaceImages, false);

    // تصاویر گالری: افزودن یا جایگزینی
    let images = project.images || [];
    if (replaceImages) {
      images = [...files.gallery];
    } else {
      images = [...new Set([...images, ...files.gallery])];
    }

    // کاور
    let coverImage = project.coverImage;
    if (files.cover) coverImage = files.cover;
    else if (body.coverImageUrl) coverImage = body.coverImageUrl;

    // اگر کاور جدید از گالری انتخاب نشده و گالری جایگزین شده، کاور را هم با اولین تصویر هماهنگ کن
    if (replaceImages && images.length > 0 && !files.cover && !body.coverImageUrl) {
      coverImage = images[0];
    }
    if (images.length === 0 && files.gallery.length === 0) {
      // اگر همه تصاویر حذف شده‌اند ولی کاور جداگانه هست، کاور می‌ماند
    }

    await projectService.updateProject(project._id, body);
    const updated = await Project.findById(project._id);
    updated.images = images;
    updated.coverImage = coverImage;
    if (files.before) updated.beforeImage = files.before;
    if (files.after) updated.afterImage = files.after;
    if (body.beforeImageUrl) updated.beforeImage = body.beforeImageUrl;
    if (body.afterImageUrl) updated.afterImage = body.afterImageUrl;

    const saved = await updated.save();
    const populated = await Project.findById(saved._id).populate('category', 'name slug image');
    return ok(res, populated, 'پروژه با موفقیت به‌روزرسانی شد.');
  } catch (err) {
    cleanupFiles(req);
    return next(err);
  }
}

/**
 * DELETE /api/admin/projects/:id
 */
async function adminDelete(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return fail(res, 404, 'پروژه موردنظر یافت نشد.', 'NOT_FOUND');
    }

    // حذف فایل‌های آپلودشده
    const urls = [
      project.coverImage,
      project.beforeImage,
      project.afterImage,
      ...(project.images || []),
    ];
    urls.forEach((url) => deleteUploadedFile(url));

    return ok(res, null, 'پروژه با موفقیت حذف شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  publicList,
  publicGetById,
  adminList,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminDelete,
};
