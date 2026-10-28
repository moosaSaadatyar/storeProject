const SiteSettings = require('./settings.model');
const { ok, fail } = require('../../utils/api-response');
const { toPublicUrl } = require('../../middlewares/upload.middleware');
const { safeJson, safeJsonArray, deleteUploadedFile } = require('../../utils/helpers');

const SINGLETON_ID = 'singleton';

/**
 * خواندن تنظیمات (سند واحد)
 */
async function getSettings() {
  return SiteSettings.findById(SINGLETON_ID).lean();
}

/**
 * GET /api/settings/public — تنظیمات عمومی برای هدر/فوتر/خانه
 */
async function publicGet(req, res, next) {
  try {
    const settings = await getSettings();
    return ok(res, settings || {});
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/settings
 */
async function adminGet(req, res, next) {
  try {
    const settings = await getSettings();
    return ok(res, settings || {});
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/settings (multipart — فایل logo)
 * فیلدهای تودرتو (about.strengths و ...) به‌صورت JSON string ارسال می‌شوند.
 */
async function adminUpdate(req, res, next) {
  try {
    const body = req.body || {};
    const existing = await getSettings();
    const about = existing?.about || {};
    const home = existing?.home || {};

    const update = {};
    const stringFields = [
      'siteName', 'shortDescription', 'phone', 'whatsapp', 'email',
      'address', 'mapLink', 'workHours', 'instagram', 'telegram',
    ];
    for (const field of stringFields) {
      if (body[field] !== undefined) update[field] = String(body[field] ?? '').trim();
    }

    // لوگو
    const logoFile = Array.isArray(req.files) && req.files[0] ? toPublicUrl(req.files[0].path) : null;
    if (logoFile) update.logo = logoFile;

    // بخش about
    if (body['about.longText'] !== undefined || body['about.experienceYears'] !== undefined
      || body['about.strengths'] !== undefined || body['about.values'] !== undefined) {
      update.about = {
        longText: body['about.longText'] !== undefined ? String(body['about.longText']).trim() : about.longText,
        experienceYears: body['about.experienceYears'] !== undefined && body['about.experienceYears'] !== ''
          ? Number(body['about.experienceYears'])
          : about.experienceYears,
        strengths: body['about.strengths'] !== undefined ? safeJsonArray(body['about.strengths'], 20) : about.strengths,
        values: body['about.values'] !== undefined ? safeJsonArray(body['about.values'], 20) : about.values,
      };
    }

    // بخش home
    const homeFields = ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage'];
    let homeChanged = false;
    const newHome = { ...home };
    for (const field of homeFields) {
      if (body[`home.${field}`] !== undefined) {
        newHome[field] = String(body[`home.${field}`] ?? '').trim();
        homeChanged = true;
      }
    }
    if (body['home.whyUs'] !== undefined) {
      const parsed = safeJson(body['home.whyUs'], null);
      newHome.whyUs = Array.isArray(parsed)
        ? parsed
            .filter((item) => item && (item.title || item.description))
            .map((item) => ({
              title: String(item.title || '').trim(),
              description: String(item.description || '').trim(),
              icon: String(item.icon || '').trim(),
            }))
        : home.whyUs;
      homeChanged = true;
    }
    if (body['home.steps'] !== undefined) {
      const parsed = safeJson(body['home.steps'], null);
      newHome.steps = Array.isArray(parsed)
        ? parsed
            .filter((item) => item && (item.title || item.description))
            .map((item) => ({
              title: String(item.title || '').trim(),
              description: String(item.description || '').trim(),
            }))
        : home.steps;
      homeChanged = true;
    }
    if (homeChanged) update.home = newHome;

    const saved = await SiteSettings.findByIdAndUpdate(
      SINGLETON_ID,
      { $set: update },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    // اگر لوگوی قدیمی جایگزین شده، آن را حذف کن
    if (logoFile && existing?.logo && existing.logo !== logoFile) {
      deleteUploadedFile(existing.logo);
    }

    return ok(res, saved, 'تنظیمات با موفقیت ذخیره شد.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { publicGet, adminGet, adminUpdate };
