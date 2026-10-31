const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { compressImage } = require('../utils/image-compress');

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');

const ALLOWED_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // زیرپوشه از فیلد فرم `_uploadDir` می‌آید (مثلاً projects)
    const sub = req.body && req.body._uploadDir ? String(req.body._uploadDir) : 'general';
    const dir = path.join(UPLOADS_ROOT, path.basename(sub));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ALLOWED_MIME[file.mimetype]}`);
  },
});

const multerUpload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024,
    files: parseInt(process.env.MAX_FILES_PER_UPLOAD, 10) || 8,
  },
  fileFilter(req, file, cb) {
    if (ALLOWED_MIME[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('فقط تصاویر با فرمت JPEG، PNG یا WEBP مجاز است.'));
    }
  },
});

/**
 * فشرده‌سازی تصاویر بارگذاری‌شده تا زیر ۵۰۰KB — قبل از رسیدن به handler.
 * اگر اکستنشن تغییر کند (مثلاً png→jpg)، اشیاء فایل (path/filename/size)
 * به‌روزرسانی می‌شوند تا URL نهایی درست ساخته شود.
 */
function compressUploadedFiles(req, res, next) {
  // اشکال‌های ممکن: آرایه (single/array)، اشیاء (fields)، یا فایل تکی (req.file)
  let files = [];
  if (Array.isArray(req.files)) files = req.files;
  else if (req.files && typeof req.files === 'object') files = Object.values(req.files).flat();
  else if (req.file) files = [req.file];
  (async () => {
    for (const f of files) {
      let newPath;
      try {
        newPath = await compressImage(f.path);
      } catch (err) {
        // اگر پردازش تصویر شکست خورد، فایل را حذف و خطای واضح بده
        console.error('[upload] فشرده‌سازی تصویر ناموفق بود:', err);
        fs.promises.unlink(f.path).catch(() => {});
        throw new Error('پردازش تصویر ناموفق بود. فایل را با فرمت استاندارد دوباره بارگذاری کنید.');
      }
      f.path = newPath;
      f.filename = path.basename(newPath);
      f.size = fs.statSync(newPath).size;
    }
  })().then(() => next()).catch(next);
}

/** wrap: اجرای فشرده‌سازی بعد از هر آپلود multer */
function wrap(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) return next(err);
      compressUploadedFiles(req, res, next);
    });
  };
}

/** جایگزین مستقیم نمونه‌ی multer — با فشرده‌سازی خودکار بعد از ذخیره */
const upload = {
  single: (name) => wrap(multerUpload.single(name)),
  array: (name, maxCount) => wrap(multerUpload.array(name, maxCount)),
  fields: (fields) => wrap(multerUpload.fields(fields)),
};

/**
 * تبدیل مسیر ذخیره‌شده فایل به URL نسبی قابل سرو توسط express.static('/uploads')
 */
function toPublicUrl(absolutePath) {
  return '/uploads/' + path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join('/');
}

module.exports = { upload, UPLOADS_ROOT, toPublicUrl };
