const express = require('express');
const { upload, toPublicUrl } = require('../../middlewares/upload.middleware');
const { ok } = require('../../utils/api-response');

/**
 * POST /api/admin/upload — آپلود مستقل
 * multipart با فیلد files (حداکثر ۸) + _uploadDir (زیرپوشه، پیش‌فرض general)
 * پاسخ: { success, data: [{ name, url }] }
 */
const router = express.Router();

router.post('/', upload.array('files', 8), (req, res) => {
  const files = (Array.isArray(req.files) ? req.files : []).map((f) => ({
    name: f.originalname,
    url: toPublicUrl(f.path),
  }));
  return ok(res, files, 'فایل‌ها با موفقیت بارگذاری شدند.');
});

module.exports = router;
