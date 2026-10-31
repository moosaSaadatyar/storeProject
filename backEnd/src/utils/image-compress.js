const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/** سقف حجم هر تصویر بعد از فشرده‌سازی: ۵۰۰ کیلوبایت */
const MAX_IMAGE_BYTES = 500 * 1024;

/**
 * فشرده‌سازی تصویر آپلودشده تا زیر ۵۰۰KB
 *
 * - اگر فایل از پیش کوچک باشد، دست‌نخورده برمی‌گردد (مسیر همان فایل).
 * - خروجی نهایی همیشه JPEG است (برای عکس پروژه بهینه‌ترین حالت)؛
 *   اگر اکستنشن تغییر کند (مثلاً .png → .jpg)، مسیر جدید برگردانده می‌شود.
 * - اول کیفیت را کم می‌کند؛ اگر باز بزرگ بود، ابعاد را کوچک می‌کند.
 *
 * @param {string} filePath مسیر مطلق فایل ذخیره‌شده
 * @returns {Promise<string>} مسیر فایل نهایی (ممکن است اکستنشن جدید داشته باشد)
 */
async function compressImage(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size <= MAX_IMAGE_BYTES) return filePath;

  const ext = path.extname(filePath).toLowerCase();
  const outPath = ext === '.jpg' || ext === '.jpeg' ? filePath : filePath.replace(/\.[^.]+$/, '.jpg');

  // مرحله‌ی ۱: کاهش کیفیت (ابعاد تا ۲۲۰۰px)
  let buf = null;
  for (const quality of [80, 70, 60, 50, 40, 30]) {
    buf = await sharp(filePath)
      .rotate() // احترام به جهت‌گیری EXIF
      .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buf.length <= MAX_IMAGE_BYTES) break;
  }

  // مرحله‌ی ۲: اگر هنوز بزرگ بود، ابعاد را هم کوچک کن
  if (buf.length > MAX_IMAGE_BYTES) {
    for (const width of [1600, 1200, 900, 700]) {
      buf = await sharp(filePath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 65, mozjpeg: true })
        .toBuffer();
      if (buf.length <= MAX_IMAGE_BYTES) break;
    }
  }

  // ابتدا در فایل موقت می‌نویسیم؛ ویرایش درجا روی ویندوز ممکن است
  // به‌خاطر هندل بازِ sharp روی فایل ورودی شکست بخورد (UNKNOWN error)
  const tmpPath = `${outPath}.tmp-${Date.now()}-${process.pid}`;
  await fs.promises.writeFile(tmpPath, buf);
  await fs.promises.unlink(filePath);
  await fs.promises.rename(tmpPath, outPath);
  return outPath;
}

module.exports = { compressImage, MAX_IMAGE_BYTES };
