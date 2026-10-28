const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

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

const upload = multer({
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
 * تبدیل مسیر ذخیره‌شده فایل به URL نسبی قابل سرو توسط express.static('/uploads')
 */
function toPublicUrl(absolutePath) {
  return '/uploads/' + path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join('/');
}

module.exports = { upload, UPLOADS_ROOT, toPublicUrl };
