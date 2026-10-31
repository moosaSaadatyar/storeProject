# وب‌سایت کابینت‌سازی (Cabinet Store)

وب‌سایت معرفی و ثبت درخواست برای مجموعه‌ی کابینت‌سازی — شامل صفحه‌های عمومی (خانه، نمونه‌کارها، جزئیات پروژه، خدمات، درباره ما، تماس، ثبت درخواست) و پنل مدیریت کامل (پروژه‌ها، دسته‌بندی‌ها، خدمات، مشاوره‌ها، تماس‌ها، نظرات، سوالات متداول و تنظیمات سایت).

## ساختار پروژه

```
storeProject/
├── backEnd/    # API بک‌اند (Express 5 + MongoDB/Mongoose)
├── frontEnd/   # فرانت‌اند (Angular 21 + PrimeNG 21)
├── ARCHITECTURE.md  # مستندات معماری و قرارداد API
└── README.md
```

## تکنولوژی‌ها

| لایه | تکنولوژی |
|---|---|
| فرانت‌اند | Angular 21، PrimeNG 21، ngx-translate (فارسی/انگلیسی، RTL) |
| بک‌اند | Node.js، Express 5، Mongoose (MongoDB) |
| احراز هویت | JWT (Bearer) برای بخش مدیریت |
| آپلود فایل | multer (تصویر jpg/png/webp، حداکثر ۵ مگابایت، تا ۸ فایل) |

## راه‌اندازی بک‌اند

```bash
cd backEnd
npm install
copy .env.example .env   # مقادیر MONGO_URI و JWT_SECRET را تنظیم کنید
npm start                # یا npm run dev برای اجرای با --watch
```

- API روی پورت **3000** اجرا می‌شود (مثلاً `http://localhost:3000/api/health`).
- در اولین اجرا (یا وقتی دیتابیس خالی باشد) داده‌های اولیه (دسته‌بندی‌ها، پروژه‌ها، خدمات، نظرات، FAQ، تنظیمات سایت و ادمین پیش‌فرض) خودکار seed می‌شود.
- برای seed دستی: `npm run seed`
- برای حذف کامل دیتابیس: `node drop-db.js` (سپس با ری‌استارت سرور دوباره seed می‌شود)

### اطلاعات ورود مدیریت (پیش‌فرض)

| ایمیل | پسورد |
|---|---|
| `admin@cabinet.ir` | `12345678` |

> پسورد مدیر از متغیر `ADMIN_PASSWORD` در `backEnd/.env` خوانده می‌شود و هنگام seed اولیه اعمال می‌گردد. برای تغییر آن، مقدار `.env` را عوض و یک‌بار `drop-db.js` + ری‌استارت انجام دهید.

## راه‌اندازی فرانت‌اند

```bash
cd frontEnd
npm install
npm start        # اجرای dev روی http://localhost:4200
```

Build برای production:

```bash
npm run build    # خروجی در frontEnd/dist
```

آدرس API در `frontEnd/public/envierments/envierments.ts` (مفهوم `apiUrl`) تنظیم می‌شود.

## API (خلاصه)

تمام پاسخ‌ها با شکل `{ success, message, data }` و پاسخ‌های صفحه‌بندی‌شده با `{ items, total, page, totalPages }` هستند.

| مسیر | توضیح |
|---|---|
| `GET /api/health` | سلامت سرور |
| `GET /api/projects` | لیست پروژه‌های منتشرشده (فیلتر: category، style، space، featured، q، page، limit) |
| `GET /api/projects/:id` | جزئیات پروژه + پروژه‌های مرتبط |
| `GET /api/categories` | دسته‌بندی‌های فعال + شمارش پروژه‌ها |
| `GET /api/cabinet-services` | خدمات کابینت |
| `GET /api/testimonials` | نظرات تأییدشده مشتریان |
| `GET /api/faqs` | سوالات متداول فعال |
| `GET /api/settings` | تنظیمات عمومی سایت |
| `POST /api/consultations` | ثبت درخواست مشاوره (multipart، تا ۸ تصویر) |
| `POST /api/contact` | ارسال پیام تماس |
| `POST /api/admin/login` | ورود مدیریت (JWT) |
| `/api/admin/...` | CRUD پروژه/دسته/خدمت/مشاوره/تماس/نظر/FAQ + `GET /api/admin/dashboard/stats` + `PUT /api/admin/settings` + `POST /api/admin/upload` — همه با هدر `Authorization: Bearer <token>` |

تفصیل کامل در [ARCHITECTURE.md](./ARCHITECTURE.md).

## تست دود (smoke test)

تست سر به سر API (بدون نیاز به فرانت‌اند):

```bash
cd backEnd
node test/smoke.js
```

> توجه: تست دود داده‌های دیتابیس را تغییر می‌دهد؛ برای بازگرداندن داده‌های تمیز از `node drop-db.js` و ری‌استارت سرور استفاده کنید.

## ترجمه‌ها

کلیدهای ترجمه در `frontEnd/public/i18n/fa.json` و `frontEnd/public/i18n/en.json` است. زبانهای عمومی با ngx-translate مدیریت می‌شود؛ پنل مدیریت فارسی ثابت است.

## نکات

- تصاویر seed روی `frontEnd/public/images/` هستند و در دیتابیس با آدرس نسبی (`/images/...`) ثبت می‌شوند تا مستقل از دامنه‌ی سایت کار کنند.
- فایل‌های آپلودشده در پنل مدیریت در `backEnd/uploads/` ذخیره می‌شوند و از طریق `/uploads/...` سرو می‌شوند.
- **فشرده‌سازی خودکار تصاویر:** هر تصویر آپلودشده‌ی بزرگ‌تر از ۵۰۰KB به‌صورت خودکار با `sharp` فشرده می‌شود تا زیر ۵۰۰KB بماند (کاهش کیفیت و در صورت نیاز کوچک‌کردن ابعاد؛ خروجی نهایی JPEG). فایل‌های کوچک‌تر دست‌نخورده می‌مانند.
- دیتابیس محلی MongoDB با نام `cabinet-store` استفاده می‌شود.

## سئو (SEO)

سایت به‌صورت کامل برای موتورهای جستجو بهینه شده است:

- **Title و Meta Description پویا:** برای هر صفحه از طریق `data.seo` روی روت‌ها (`app.routes.ts` و `home.route.ts`) و اعمال خودکار توسط `core/seo/seo.service.ts`؛ صفحه‌ی جزئیات پروژه title و description اختصاصیِ خود پروژه را می‌گیرد.
- **Canonical و Open Graph و Twitter Card:** برای هر صفحه تنظیم می‌شود تا در اشتراک‌گذاری اجتماعی (اینستاگرام، تلگرام و…) کارت درست نمایش داده شود.
- **Canonical URL:** روی هر صفحه برای جلوگیری از محتوای تکراری.
- **داده‌های ساختاریافته (JSON-LD):**
  - `LocalBusiness` در `index.html` (اطلاعات کسب‌وکار، ساعت کاری، تلفن و آدرس)
  - `BreadcrumbList` + `CreativeWork` روی صفحه‌ی جزئیات هر پروژه
  - `FAQPage` برای بخش سوالات متداول صفحه‌ی خانه
- **robots.txt:** در `frontEnd/public/robots.txt` — پنل مدیریت از ایندکس خارج شده و Sitemap ارجاع داده شده.
- **sitemap.xml پویا:** در بک‌اند روی `/sitemap.xml` سرو می‌شود و شامل صفحات ثابت + همه‌ی پروژه‌های منتشرشده (با `lastmod`) است. مبدأ URLها از `SITEMAP_BASE_URL` می‌آید.
- **نشان robots:** صفحات ۴۰۴ و پنل مدیریت `noindex, nofollow` دارند.

> **نکته برای انتشار:** در `frontEnd/src/index.html` مقادیر `og:url` و `url` داخل JSON-LD `LocalBusiness`، در `frontEnd/public/robots.txt` خط `Sitemap:` و در `.env` متغیر `SITEMAP_BASE_URL` را با دامنه‌ی واقعی سایت جایگزین کنید.

## انتشار در Production (چک‌لیست)

1. **فرانت‌اند:** مقدار `apiUrl` و `production` در `frontEnd/public/envierments/envierments.ts` را با دامنه‌ی واقعی API تنظیم کنید، سپس `npm run build` بزنید. خروجی در `frontEnd/dist/front-end/browser/` است.
2. **هاست استاتیک:** محتوای `browser/` را روی هر هاست استاتیک (nginx و…) بگذارید و **SPA fallback** تنظیم کنید (هر مسیر ناموجود به `index.html` برسد تا deep-link‌ها مثل `/admin/login` کار کنند). مسیرهای `/api`، `/uploads` و `/sitemap.xml` را با reverse proxy به بک‌اند بفرستید.
3. **بک‌اند:** در `.env` مقادیر زیر را تغییر دهید:
   - `MONGO_URI` → آدرس MongoDB واقعی
   - `JWT_SECRET` → رشته‌ی تصادفی طولانی
   - `CORS_ORIGIN` → دامنه‌ی سایت (مثلاً `https://example.com`)
   - `SITEMAP_BASE_URL` → دامنه‌ی سایت (برای تولید sitemap.xml)
   - `ADMIN_PASSWORD` → رمز قوی برای اولین seed
4. **TLS:** بک‌اند را پشت reverse proxy با HTTPS (nginx + گواهی) اجرا کنید.
5. **امنیت پس از راه‌اندازی:**
   - پسورد مدیر را تغییر دهید (با یک اسکریپت ساده یا `mongosh`: `bcrypt.hash` جدید در collection `admins`).
   - ورود به پنل فقط از طریق `/admin/login` ممکن است؛ `JWT_EXPIRES_IN` را در صورت نیاز کوتاه‌تر کنید.
   - محدودیت‌های داخلی: حداکثر ۱۰ تلاش ورود در ۱۵ دقیقه و ۲۰ ارسال فرم در ساعت به ازای هر IP.
6. **بک‌آپ:** بک‌آپ دوره‌ای از دیتابیس MongoDB و پوشه‌ی `backEnd/uploads/` بگیرید.
