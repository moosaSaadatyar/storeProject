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
| `admin@cabinet.ir` | `Admin1234!` |

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

- تصاویر seed روی `frontEnd/public/images/` هستند و در دیتابیس با آدرس مطلق ثبت می‌شوند.
- فایل‌های آپلودشده در پنل مدیریت در `backEnd/uploads/` ذخیره می‌شوند و از طریق `/uploads/...` سرو می‌شوند.
- دیتابیس محلی MongoDB با نام `cabinet-store` استفاده می‌شود.
