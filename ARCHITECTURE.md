# معماری سایت کابینت‌سازی — storeProject

> سند مرجع معماری برای تمام مراحل پیاده‌سازی. هر تغییری در این سند باید قبل از اجرا تأیید شود.

## ۰. تصمیمات تأییدشده

| # | تصمیم | توضیح |
|---|---|---|
| ۱ | پایگاه داده: **MongoDB** (Mongoose) | مطابق بیان کاربر و بک‌اند فعلی؛ گزینه‌ی SQL در سرفصل نادیده گرفته شد |
| ۲ | تبدیل مفهوم `product` فروشگاهی به «پروژه / نمونه‌کار کابینت» | فرم، جدول `mo-table` و ساختار feature حفظ و فیلدها تغییر می‌کنند |
| ۳ | اکانت مدیر اولیه با اسکریپت seed | ایمیل/رمز از `.env` خوانده می‌شود (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) |
| ۴ | داده‌های آزمایشی در مرحله توسعه | تصاویر موجود `public/images` و متن‌های نمونه به‌صورت داده‌ی seed مشخص |

---

## ۱. فرانت‌اند — صفحات و مسیرها

### ۱.۱ نقشه‌ی روتر

| مسیر | صفحه | وضعیت |
|---|---|---|
| `/` | redirect به `/home` | موجود |
| `/home` | صفحه خانه (بنر، درباره کوتاه، دسته‌بندی، جدیدترین/منتخب، خدمات، مراحل همکاری، نظرات، FAQ، فرم مشاوره) | موجود — بسط می‌یابد |
| `/portfolio` | نمونه‌کارها: گالری + فیلتر (نوع کابینت / سبک / فضای اجرا) + صفحه‌بندی | **جدید** |
| `/projects/:id` | جزئیات پروژه: گالری، قبل/بعد، مشخصات فنی، دکمه «پروژه مشابه»، نمونه‌کارهای مرتبط | **جدید** |
| `/services` | خدمات دسته‌بندی‌شده (هر خدمت: تصویر، توضیح، دکمه مشاوره) | **جدید** |
| `/about` | درباره ما: معرفی، سابقه، شیوه اجرا، مزیت‌ها، ارزش‌ها | **جدید** |
| `/contact` | تماس: تلفن، واتساپ، آدرس، نقشه، ساعات کاری، فرم تماس، شبکه‌های اجتماعی | **جدید** |
| `/request` | درخواست مشاوره و برآورد قیمت (فرم کامل + آپلود تصویر) | موجود — بسط می‌یابد |
| `/admin/login` | ورود مدیر | **جدید** |
| `/admin` | پنل مدیریت (چیدمان سایدبار) با گارد احراز هویت | **جدید** |
| `/admin/dashboard` | داشبورد آماری | جدید |
| `/admin/projects` و `/admin/projects/:id/edit` | مدیریت نمونه‌کارها (CRUD + چند تصویر) | جدید (جایگزین `feature/product`) |
| `/admin/categories` | مدیریت دسته‌بندی‌ها | جدید |
| `/admin/services` | مدیریت خدمات | جدید |
| `/admin/consultations` | مدیریت درخواست‌های مشاوره + تغییر وضعیت | جدید |
| `/admin/contact` | مشاهده پاسخ‌های تماس | جدید |
| `/admin/testimonials` | مدیریت نظرات (تأیید/رد) | جدید |
| `/admin/faqs` | مدیریت سوالات متداول | جدید |
| `/admin/settings` | تنظیمات سایت (تماس، آدرس، ساعات، شبکه‌ها، محتوای خانه) | جدید |
| `*` | صفحه ۴۰۴ | جدید |

### ۱.۲ درخت روتر (lazy-loading)

```
app.routes.ts
├── ''            → HomeRoutes (موجود: /home, /request)
├── 'portfolio'   → loadComponent: PortfolioPage
├── 'projects/:id'→ loadComponent: ProjectDetailPage
├── 'services'    → loadComponent: ServicesPage
├── 'about'       → loadComponent: AboutPage
├── 'contact'     → loadComponent: ContactPage
├── 'admin'       → loadChildren: admin/admin.route.ts
│   ├── 'login'          → AdminLoginPage  (گارد: block-auth)
│   └── ''  (آئوت‌لیت، گارد: auth)
│       ├── ''            → redirect 'dashboard'
│       ├── 'dashboard'   → AdminDashboard
│       ├── 'projects'    → AdminProjects (لیست + فرم create)
│       ├── 'projects/:id/edit' → AdminProjectEdit
│       ├── 'categories'  → AdminCategories
│       ├── 'services'    → AdminServices
│       ├── 'consultations' → AdminConsultations
│       ├── 'contact'     → AdminContact
│       ├── 'testimonials'→ AdminTestimonials
│       ├── 'faqs'        → AdminFaqs
│       └── 'settings'    → AdminSettings
└── '**'          → NotFoundPage
```

### ۱.۳ چیدمان (layout)

- **عمومی:** `app.component.html` فعلی (header + router-outlet + footer) بدون تغییر ساختار.
- **پنل مدیریت:** `AdminLayout` با سایدبار (PrimeNG PanelMenu) + topbar (نام مدیر + خروج). هدر/فوتر عمومی در پنل نمایش داده **نمی‌شوند** → برای این مورد از یک روت آئوت‌پوش استفاده می‌شود: `app.component.html` فقط `<router-outlet>` می‌ماند و header/footer به یک `PublicLayout` منتقل می‌شود که صفحات عمومی داخل آن لاود می‌شوند.

### ۱.۴ ساختار پوشه‌های جدید (بسط `feature` فعلی، نه بازنویسی)

```
src/app/
├── core/
│   ├── guards/          ← auth.guard.ts, block-auth.guard.ts
│   ├── interceptors/    ← auth.interceptor.ts (هدر توکن), error.interceptor.ts (نمایش خطای استاندارد)
│   ├── service/
│   │   └── auth/        ← auth.service.ts (login/logout/token, signal)
│   └── interface/       ← انواع TS: IProject, ICategory, IService, IConsultation,
│                          IContactMessage, ITestimonial, IFaq, ISiteSettings, IAdmin, IPagedResult
├── feature/
│   ├── portfolio/       ← portfolio.page.ts/html/css
│   ├── project-detail/  ← project-detail.page.ts/html/css
│   ├── services/        ← services.page.ts/html/css
│   ├── about/           ← about.page.ts/html/css
│   ├── contact/         ← contact.page.ts/html/css
│   ├── user-request-form/  ← (موجود) بسط فیلدها + ارسال به API
│   └── admin/
│       ├── admin.route.ts
│       ├── admin-layout/
│       ├── login/
│       ├── dashboard/
│       ├── projects/    ← لیست (mo-table) + فرم (create/edit با mo-file-uploader)
│       ├── categories/
│       ├── services/
│       ├── consultations/
│       ├── contact/
│       ├── testimonials/
│       ├── faqs/
│       └── settings/
└── shared/
    ├── ui/
    │   ├── home-page/            ← (موجود) ترکیب سکشن‌های جدید
    │   ├── categories-section/   ← جدید: دسته‌بندی انواع کابینت
    │   ├── latest-projects/      ← جدید: جدیدترین نمونه‌کارها (از API)
    │   ├── featured-projects/    ← جدید: پروژه‌های منتخب
    │   ├── services-section/     ← جدید: معرفی خدمات (از API)
    │   ├── steps-section/        ← جدید: مراحل همکاری
    │   ├── testimonials-section/ ← جدید: نظرات تأییدشده
    │   ├── faq-section/          ← جدید: سوالات متداول (Accordion)
    │   └── consultation-form/    ← جدید: فرم مشاوره‌ی فشرده در خانه
    ├── dynamics/
    │   └── project-card/         ← جدید: کارت نمونه‌کار (تصویر، عنوان، نوع، متریال)
    └── services/                 ← سرویس‌های عمومی (زیرکلاس‌های GenericApiService)
```

### ۱.۵ سرویس‌ها و مدیریت وضعیت

- سرویس‌های عمومی روی الگوی موجود `GenericApiService` ساخته می‌شوند:
  `ProjectService`, `CategoryService`, `CabinetServicesService`, `ConsultationService`,
  `ContactService`, `SettingsService`, `TestimonialService`, `FaqService`
- سرویس‌های مدیریتی: `AdminAuthService` + زیرکلاس‌های GenericApi برای CRUDها
- **`SiteSettingsService`** با **signal** — یک بار بارگذاری می‌شود (در `ngOnInit` layout عمومی)؛ هدر/فوتر/خانه از آن می‌خوانند.
- فیلترها و وضعیت محلی صفحات (مثلاً فیلترهای پورتفولیو، پاجینیشن) با **signals** در خود کامپوننت.
- **Auth:** توکن در `localStorage`، اینترسپتر هدر `Authorization: Bearer` را اضافه می‌کند؛ پاسخ ۴۰۱ → پاک‌سازی + redirect به `/admin/login`.
- یکنواخت‌سازی پیشوند API: همه درخواست‌ها به فرم `{apiUrl}/api/...` (بک‌اند همه روت‌ها را زیر `/api` مانت می‌کند؛ سرویس فعلی `service-api.service.ts` حذف و جایگزین می‌شود).

---

## ۲. بک‌اند — ساختار

```
backEnd/
├── src/
│   ├── config/
│   │   ├── env.js              ← خواندن dotenv + اعتبارسنجی متغیرها
│   │   └── constants.js        ← شمارنده‌ها، enumها (سبک‌ها، فضاها، وضعیت‌ها)
│   ├── database/
│   │   └── db.js               ← اتصال Mongoose + لاگ
│   ├── modules/
│   │   ├── projects/           ← project.model.js, project.controller.js,
│   │   │                         project.routes.js, project.service.js
│   │   ├── categories/
│   │   ├── services/
│   │   ├── consultations/
│   │   ├── contact/
│   │   ├── testimonials/
│   │   ├── faqs/
│   │   ├── settings/           ← سند تک‌مرحله‌ای SiteSettings
│   │   └── admins/             ← admin.model.js + auth (login, me)
│   ├── middlewares/
│   │   ├── auth.middleware.js      ← بررسی JWT
│   │   ├── upload.middleware.js    ← multer (محدودیت نوع/حجم/تعداد)
│   │   ├── validate.middleware.js  ← اعتبارسنجی body/params
│   │   └── error.middleware.js     ← پاسخ خطای استاندارد + 404
│   └── utils/
│       ├── api-response.js   ← ok(res, data, msg), fail(res, status, msg, code)
│       ├── jwt.js            ← sign/verify
│       └── seed.js           ← ایجاد مدیر اولیه + داده‌های نمونه (اختیاری)
├── uploads/                ← تصاویر آپلودشده (gitignored)
├── app.js                  ← فقط ساختن اپ (express, cors, json, static, routes)
├── server.js               ← اتصال DB + listen
├── .env / .env.example
└── package.json
```

- `app.js` فعلی بازچیده می‌شود: روت‌های قدیمی (`/get-productes`, `/product`) با معادل‌های جدید جایگزین می‌شوند.
- مدل `product.js` و روت/کنترلرهای آن **حذف** و با ماژول `projects` جایگزین می‌شوند (تصمیم ۲).

### تنظیمات محیطی (`.env.example`)

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/cabinet-store
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=12h
CORS_ORIGIN=http://localhost:4200
MAX_FILE_SIZE_MB=5
MAX_FILES_PER_UPLOAD=8
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

به `backEnd/.gitignore` افزوده می‌شود: `.env`, `uploads/`.

---

## ۳. مدل‌های پایگاه داده (Mongoose)

### Admin
```js
{ name: String, email: {String, unique, required}, password: String /*bcrypt hash*/,
  isActive: {Boolean, default: true}, timestamps }
```

### Project
```js
{
  title: {String, required},
  shortDescription: String,
  fullDescription: String,
  coverImage: {String, required},          // مسیر /uploads/...
  images: [String],                        // گالری
  beforeImage: String, afterImage: String, // قبل/بعد (اختیاری)
  category: ObjectId → Category (required),
  style: {String, enum: [modern, neoclassical, classic]},
  space: {String, enum: [kitchen, wardrobe, closet, island, office, living]},
  bodyMaterial: String,                    // جنس بدنه
  doorMaterial: String,                    // جنس درب
  countertop: String,                      // صفحه کابینت
  hardware: String,                        // یراق‌آلات
  features: [String],                      // امکانات و ویژگی‌ها
  area: { value: Number, unit: {String, default: 'متر مربع'} },  // اختیاری
  duration: String,                        // زمان اجرا، اختیاری
  location: String,                        // شهر/منطقه، اختیاری
  isFeatured: {Boolean, default: false},
  isPublished: {Boolean, default: true},
  timestamps
}
```
شاخص: `{ category: 1, style: 1, space: 1 }` برای فیلترها.

### Category
```js
{ name: {String, required}, slug: {String, unique}, description: String,
  image: String, icon: String, sortOrder: {Number, default: 0},
  isActive: {Boolean, default: true}, timestamps }
```

### Service
```js
{ title: {String, required}, description: String, details: String,
  image: String, features: [String], sortOrder: Number,
  isActive: {Boolean, default: true}, timestamps }
```

### Consultation
```js
{
  fullName: {String, required}, phone: {String, required},
  serviceType: String, cabinetType: String, style: String, color: String,
  dimensions: String,          // ابعاد/متراژ تقریبی
  city: String,                // شهر/منطقه
  budget: String,              // اختیاری (بازه)
  description: String,
  files: [String],             // تصاویر آپلودشده
  status: {String, enum: [new, in-progress, completed, cancelled], default: 'new'},
  adminNote: String,
  timestamps
}
```

### ContactMessage
```js
{ fullName, phone, email, subject, message: String,
  status: {String, enum: [new, answered], default: 'new'}, timestamps }
```

### Testimonial
```js
{ customerName: String, comment: {String, required},
  rating: {Number, min:1, max:5}, projectType: String,
  isApproved: {Boolean, default: false}, sortOrder: Number, timestamps }
```
> ثبت عمومی از طریق API با `isApproved=false`؛ نمایش عمومی فقط موارد تأییدشده.

### Faq
```js
{ question: {String, required}, answer: {String, required},
  sortOrder: Number, isActive: {Boolean, default: true}, timestamps }
```

### SiteSettings (سند واحد، `_id: 'singleton'`)
```js
{
  siteName: String, logo: String, shortDescription: String,
  phone: String, whatsapp: String, email: String,
  address: String, mapLink: String,
  workHours: String,                      // مثال: «شنبه تا پنج‌شنبه ۹ تا ۱۸»
  instagram: String, telegram: String,
  about: { longText: String, experienceYears: Number,
           strengths: [String], values: [String] },
  home: { heroTitle: String, heroSubtitle: String, heroDescription: String,
          heroImage: String,
          whyUs: [{ title, description, icon }],
          steps:  [{ title, description }] }
}
```

---

## ۴. قرارداد API

### ۴.۱ شکل پاسخ استاندارد (همه endpointها)
```json
{ "success": true,  "message": "اختیاری", "data": ... }
{ "success": false, "message": "پایگاه داده در دسترس نیست", "code": "DB_ERROR" }
```
لیست‌های صفحه‌بندی‌شده:
```json
"page=1&limit=12" →
{ "success": true, "data": { "items": [...], "total": 34, "page": 1, "totalPages": 3 } }
```

### ۴.۲ عمومی (بدون احراز هویت)
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/api/health` | سلامت سرویس |
| GET | `/api/projects` | فیلترها: `category` (slug), `style`, `space`, `featured`, `q` + `page`, `limit` |
| GET | `/api/projects/:id` | جزئیات + `related` (تا ۴ پروژه هم‌دسته) |
| GET | `/api/categories` | دسته‌های فعال |
| GET | `/api/services` | خدمات فعال |
| POST | `/api/consultations` | ثبت درخواست مشاوره (با فایل‌های multipart) |
| POST | `/api/contact` | ثبت پیام تماس |
| GET | `/api/testimonials` | فقط تأییدشده |
| POST | `/api/testimonials` | ثبت نظر عمومی → `isApproved=false` |
| GET | `/api/faqs` | سوالات فعال |
| GET | `/api/settings/public` | تنظیمات عمومی برای هدر/فوتر/خانه |

### ۴.۳ مدیریتی (با `Authorization: Bearer <JWT>`)
| متد | مسیر | توضیح |
|---|---|---|
| POST | `/api/admin/login` | ورود → `{ token, admin: {id, name, email} }` |
| GET | `/api/admin/me` | اطلاعات مدیر توکن |
| GET | `/api/admin/dashboard/stats` | شمار پروژه/دسته/خدمت، درخواست‌ها بر اساس وضعیت، پیام‌های جدید، نظرات در انتظار |
| GET/POST | `/api/admin/projects` | لیست (همه شامل پیش‌نویس) / ایجاد (multipart چند تصویر) |
| GET/PUT/DELETE | `/api/admin/projects/:id` | جزئیات / ویرایش / حذف |
| CRUD | `/api/admin/categories` | |
| CRUD | `/api/admin/services` | |
| GET | `/api/admin/consultations?status=` | لیست درخواست‌ها |
| GET | `/api/admin/consultations/:id` | جزئیات (با فایل‌ها) |
| PUT | `/api/admin/consultations/:id/status` | تغییر وضعیت + یادداشت مدیر |
| DELETE | `/api/admin/consultations/:id` | |
| GET/PUT/DELETE | `/api/admin/contact[/:id]` | پیام‌ها + وضعیت `answered` |
| CRUD + PUT `/:id/approve` | `/api/admin/testimonials` | مدیریت نظرات |
| CRUD | `/api/admin/faqs` | |
| GET/PUT | `/api/admin/settings` | تنظیمات سایت (multipart برای لوگو) |
| POST | `/api/admin/upload` | آپلود مستقل → `[{ name, url }]` |

### ۴.۴ آپلود فایل
- multer با `diskStorage` → `uploads/projects/<uuid>-<name>`
- محدودیت‌ها: `jpeg|png|webp`، حداکثر ۵MB برای هر فایل، حداکثر ۸ فایل
- سرو استاتیک: `app.use('/uploads', express.static(...))`
- مسیرهای ذخیره‌شده به شکل نسبی (`/uploads/...`)؛ فرانت با `apiUrl` آن‌ها را کامل می‌کند.

### ۴.۵ احراز هویت و امنیت
- رمز مدیر: hash با bcrypt (cost 10) — هرگز در پاسخ‌های API نمایش داده نمی‌شود
- JWT: payload `{ sub: adminId, email }`، انقضا `JWT_EXPIRES_IN`
- میانی‌اف `verifyAuth` روی کل روتر `/api/admin` (به‌جز `/login`)
- اعتبارسنجی ورودی در همه endpointها (الزامی بودن، طول، فرمت موبایل `^09\d{9}$`)
- مدیریت خطای متمرکز + پاسخ ۴۰۴ برای مسیرهای ناموجود
- CORS فقط از `CORS_ORIGIN`

---

## ۵. نقشه‌ی اجرایی مراحل (پشتیبان از این سند)

| مرحله | خروجی |
|---|---|
| ۳ | هدر/فوتر نهایی + `PublicLayout` + تنظیمات منو + اصلاح angular.json (فایل سبک گلوبال و فونت) |
| ۴ | صفحه خانه کامل با داده‌های نمونه (mock در لایه سرویس تا اتصال API) |
| ۵ | پورتفولیو + جزئیات پروژه (فیلتر، گالری، مرتبط) |
| ۶ | خدمات + درباره ما + تماس |
| ۷ | فرم مشاوره کامل + ارسال |
| ۸ | بک‌اند کامل (ماژول‌ها، مدل‌ها، احراز هویت، آپلود، seed) |
| ۹ | اتصال فرانت به API + اینترسپترها |
| ۱۰ | پنل مدیریت کامل |
| ۱۱ | تست ریسپانسیو، اعتبارسنجی و خطاها |
| ۱۲ | README، .gitignore ریشه، `.env.example`، آماده‌سازی استقرار |
