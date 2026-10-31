/**
 * ساخت Express App — فقط تعریف سرور (اتصال DB و listen در server.js)
 * همه‌ی endpointها زیر پیشوند /api مانت می‌شوند.
 */
require('./src/config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { UPLOADS_ROOT } = require('./src/middlewares/upload.middleware');
const verifyAuth = require('./src/middlewares/auth.middleware');
const { notFoundHandler, errorHandler } = require('./src/middlewares/error.middleware');
const { ok } = require('./src/utils/api-response');

// ماژول‌ها — هر روتر دو خروجی دارد: router (عمومی) و adminRouter (مدیریتی)
const projectsRouter = require('./src/modules/projects/project.routes');
const categoriesRouter = require('./src/modules/categories/categories.routes');
const cabinetServicesRouter = require('./src/modules/services/services.routes');
const consultationsRouter = require('./src/modules/consultations/consultations.routes');
const contactRouter = require('./src/modules/contact/contact.routes');
const testimonialsRouter = require('./src/modules/testimonials/testimonials.routes');
const faqsRouter = require('./src/modules/faqs/faqs.routes');
const settingsRouter = require('./src/modules/settings/settings.routes');
const adminAuthRouter = require('./src/modules/admins/admin.routes');
const { me } = require('./src/modules/admins/admin.routes');
const dashboardRouter = require('./src/modules/dashboard/dashboard.routes');
const uploadRouter = require('./src/modules/upload/upload.routes');

const app = express();

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',').map((s) => s.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// هدرهای امنیتی استاندارد
// cross-origin: تصاویر /uploads و seed برای فرانت‌اند (dev روی پورت جدا) سرو می‌شوند
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// پاسخ سازگار با قرارداد API برای درخواست‌های محدودشده
function rateLimitHandler(req, res) {
  res.status(429).json({
    success: false,
    message: 'درخواست‌های شما مکرر است. لطفاً کمی بعد دوباره تلاش کنید.',
    code: 'RATE_LIMITED',
  });
}

// محدودیت تلاش برای ورود مدیر (جلوگیری از brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// محدودیت فرم‌های عمومی (جلوگیری از اسپم)
const formsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// سرو استاتیک فایل‌های آپلودشده (مسیرهای ناموجود به notFoundHandler می‌رسند)
app.use('/uploads', express.static(UPLOADS_ROOT));

// sitemap.xml پویا (صفحات ثابت + پروژه‌های منتشرشده) — برای موتورهای جستجو
const sitemapRouter = require('./src/routes/sitemap.routes');
app.use('/sitemap.xml', sitemapRouter);

// ============================ عمومی ============================

app.get('/api/health', (req, res) => {
  ok(res, { status: 'ok', uptime: process.uptime() });
});

app.use('/api/projects', projectsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/services', cabinetServicesRouter);
app.use('/api/consultations', formsLimiter, consultationsRouter);
app.use('/api/contact', formsLimiter, contactRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/settings', settingsRouter);

// ============================ مدیریتی ============================

// ورود — بدون احراز هویت (با محدودیت تعداد تلاش)
app.use('/api/admin/login', loginLimiter, adminAuthRouter);

// بقیه‌ی /api/admin — با احراز هویت
app.use('/api/admin', verifyAuth);
app.get('/api/admin/me', me);
app.use('/api/admin/dashboard', dashboardRouter);
app.use('/api/admin/projects', projectsRouter.adminRouter);
app.use('/api/admin/categories', categoriesRouter.adminRouter);
app.use('/api/admin/services', cabinetServicesRouter.adminRouter);
app.use('/api/admin/consultations', consultationsRouter.adminRouter);
app.use('/api/admin/contact', contactRouter.adminRouter);
app.use('/api/admin/testimonials', testimonialsRouter.adminRouter);
app.use('/api/admin/faqs', faqsRouter.adminRouter);
app.use('/api/admin/settings', settingsRouter.adminRouter);
app.use('/api/admin/upload', uploadRouter);

// ============================ خطاها ============================

// 404 برای مسیرهای ناموجود
app.use(notFoundHandler);
// مدیریت خطای متمرکز
app.use(errorHandler);

module.exports = app;
