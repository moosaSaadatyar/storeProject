/**
 * seed — ایجاد مدیر اولیه + داده‌های نمونه (فقط در محیط توسعه)
 *
 * - اجرا خودکار: در هر استارت سرور (server.js)
 * - اجرا دستی: node src/utils/seed.js
 *
 * داده‌های نمونه فقط وقتی درج می‌شوند که:
 *   1. SEED_SAMPLE_DATA !== 'false'
 *   2. جدول projects خالی باشد
 */
require('../config/env');

const bcrypt = require('bcryptjs');

/**
 * اجرای seed — فرض: اتصال DB برقرار است
 */
async function seedDatabase() {
  const Admin = require('../modules/admins/admin.model');
  const Category = require('../modules/categories/categories.model');
  const Project = require('../modules/projects/project.model');
  const CabinetService = require('../modules/services/services.model');
  const Testimonial = require('../modules/testimonials/testimonials.model');
  const Faq = require('../modules/faqs/faqs.model');
  const SiteSettings = require('../modules/settings/settings.model');

  /* ================= 1. مدیر اولیه ================= */
  const adminEmail = String(process.env.ADMIN_EMAIL || 'admin@cabinet.ir').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234!';
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({
      name: 'مدیر سیستم',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
    });
    console.log(`[seed] حساب مدیر ایجاد شد: ${adminEmail}`);
  }

  /* ================= 2. داده‌های نمونه ================= */
  const origin = String(process.env.CORS_ORIGIN || 'http://localhost:4200').replace(/\/+$/, '');
  const img = (name) => `${origin}/images/${name}`;

  let seededSample = false;
  if ((process.env.SEED_SAMPLE_DATA || 'true') !== 'false' && (await Project.countDocuments()) === 0) {
    seededSample = true;

  // دسته‌بندی‌ها
  const [kitchen, wardrobe, entry, island, office, living] = await Category.create([
    { name: 'کابینت آشپزخانه', slug: 'kitchen-cabinet', icon: 'fa-solid fa-kitchen-set', image: img('a.jpg'), sortOrder: 1, description: 'طراحی و اجرای انواع کابینت آشپزخانه با سبک مدرن، نئوکلاسیک و کلاسیک' },
    { name: 'کمد دیواری', slug: 'wardrobe', icon: 'fa-solid fa-door-closed', image: img('r.jpg'), sortOrder: 2, description: 'کمد دیواری تا سقف با طراحی داخلی بهینه و دسترسی آسان' },
    { name: 'کمد ورودی', slug: 'entry-closet', icon: 'fa-solid fa-door-open', image: img('q.jpg'), sortOrder: 3, description: 'کمد ورودی با فضای مناسب برای کفش، لباس و لوازم روزمره' },
    { name: 'جزیره آشپزخانه', slug: 'kitchen-island', icon: 'fa-solid fa-table', image: img('c.jpg'), sortOrder: 4, description: 'جزیره آشپزخانه با صفحه کوارتز و گرانیت برای فضای باز' },
    { name: 'کابینت اداری', slug: 'office-cabinet', icon: 'fa-solid fa-briefcase', image: img('d.jpg'), sortOrder: 5, description: 'مبل و کابینت اداری برای دفتر و سازمان' },
    { name: 'کابینت نشیمن', slug: 'living-cabinet', icon: 'fa-solid fa-couch', image: img('e.jpg'), sortOrder: 6, description: 'ست نشیمن و دیوارTV با طراحی هماهنگ با فضای خانه' },
  ]);

  // پروژه‌ها (نمونه‌کارها)
  await Project.create([
    {
      title: 'آشپزخانه مدرن دوطرفه',
      shortDescription: 'آشپزخانه دوطرفه با متریال MDF و درب لمینت سفید مات',
      fullDescription: 'این آشپزخانه برای آپارتمان ۱۲۰ متری در منطقه ۲ تهران طراحی شد. با استفاده از کابینت دوطرفه و جزیره کوچک، فضای کار به‌حداکثر رسیده و نورپردازی LED مخفی حس فضای بزرگ‌تری ایجاد می‌کند. صفحه کابینت از گرانیت مشکی و یراق‌آلات استیل طلایی است.',
      coverImage: img('f.jpg'),
      images: [img('f.jpg'), img('w.jpg'), img('x.jpg')],
      category: kitchen._id,
      style: 'modern',
      space: 'kitchen',
      bodyMaterial: 'MDF ضد آب',
      doorMaterial: 'لمینت مات',
      countertop: 'گرانیت مشکی',
      hardware: 'استیل طلایی — برند Hettich',
      features: ['نورپردازی LED مخفی', 'فرد داخلی مخفی', 'دستشویی کشویی', 'سیستم بازبندی اتوماتیک'],
      area: { value: 18, unit: 'متر مربع' },
      duration: '۳ هفته',
      location: 'تهران — منطقه ۲',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'آشپزخانه نئوکلاسیک یک‌خطی',
      shortDescription: 'کابینت یک‌خطی نئوکلاسیک با پنل‌های فرنیچ و رنگ براق',
      fullDescription: 'طراحی نئوکلاسیک با ترکیب کرم و طلایی برای آشپزخانه یک‌خطی. درب‌ها با فرنیچ دستی و صفحه کابینت کوارتز کرم. فضای نگهداری شامل دو کشوی پایین، کابینت بالایی تا سقف و ستون انباری است.',
      coverImage: img('w.jpg'),
      images: [img('w.jpg'), img('1.jpg')],
      category: kitchen._id,
      style: 'neoclassical',
      space: 'kitchen',
      bodyMaterial: 'MDF',
      doorMaterial: 'فرنیچ و رنگ براق',
      countertop: 'کوارتز کرم',
      hardware: 'طلایی مات',
      features: ['فرنیچ دستی', 'ستون انباری', 'قفسه چرخان'],
      area: { value: 12, unit: 'متر مربع' },
      duration: '۲ هفته و ۵ روز',
      location: 'تهران — شهرک غرب',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'کمد دیواری تمام‌قد با نورپردازی',
      shortDescription: 'کمد دیواری تا سقف با قفسه LED و ریل شلوار',
      fullDescription: 'کمد دیواری ۳.۲ متری در ورودی اتاق خواب اصلی. درب‌های MDF رنگ شیری با دستگیره مخفی، قفسه‌های داخلی با نور LED سنسوردار و ریل شلوار در بخش پایینی.',
      coverImage: img('x.jpg'),
      images: [img('x.jpg'), img('z.jpg')],
      category: wardrobe._id,
      style: 'modern',
      space: 'wardrobe',
      bodyMaterial: 'MDF',
      doorMaterial: 'رنگ شیری مات',
      hardware: 'دستگیره مخفی',
      features: ['نور LED سنسوردار', 'ریل شلوار', 'آینه داخلی'],
      area: { value: 6.5, unit: 'متر مربع' },
      duration: '۱۰ روز',
      location: 'تهران — پونک',
      isPublished: true,
    },
    {
      title: 'کمد ورودی کلاسیک دو‌بند',
      shortDescription: 'کمد ورودی کلاسیک با آینه و قفسه کفش',
      fullDescription: 'کمد ورودی کلاسیک با فرنیچ قهوه‌ای، آینه تمام‌قد وسط و قفسه کفش چرخان پایین. برای ورودی خانه‌های ویلایی مناسب است.',
      coverImage: img('1.jpg'),
      images: [img('1.jpg')],
      category: entry._id,
      style: 'classic',
      space: 'closet',
      bodyMaterial: 'MDF',
      doorMaterial: 'فرنیچ قهوه‌ای',
      hardware: 'نجف‌کار طلایی',
      features: ['آینه تمام‌قد', 'قفسه کفش چرخان', 'نوار روشنایی بالای آینه'],
      duration: '۸ روز',
      location: 'کرج — پانزدهخرداد',
      isPublished: true,
    },
    {
      title: 'جزیره آشپزخانه با صفحه کوارتز',
      shortDescription: 'جزیره ۲.۵ متری با صندلی و سینک زیر صفحه',
      fullDescription: 'جزیره آشپزخانه برای فضای باز خانه در شمال تهران. بدنه MDF ضد آب، درب لمینت طوسی، صفحه کوارتز گری با سینک فروخورده و شیرآلات ایتالیایی.',
      coverImage: img('z.jpg'),
      images: [img('z.jpg'), img('f.jpg')],
      category: island._id,
      style: 'modern',
      space: 'island',
      bodyMaterial: 'MDF ضد آب',
      doorMaterial: 'لمینت طوسی',
      countertop: 'کوارتز گری',
      hardware: 'استیل مات',
      features: ['سینک فروخورده', 'فضای صندلی', 'جک برق داخلی'],
      area: { value: 4, unit: 'متر مربع' },
      duration: '۹ روز',
      location: 'شمال تهران',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'کابینت اداری مدیریت',
      shortDescription: 'ست اداری نئوکلاسیک برای دفتر مدیریت',
      fullDescription: 'ست کابینت اداری شامل میز مدیریت، کمد اسناد و کتابخانه برای دفتر ۴۰ متری. متریال چوب طبیعی گردو با رنگ روغنی و یراق‌آلات برنجی.',
      coverImage: img('s.jpg'),
      images: [img('s.jpg'), img('q.jpg')],
      category: office._id,
      style: 'neoclassical',
      space: 'office',
      bodyMaterial: 'چوب گردو',
      doorMaterial: 'پنل چوب طبیعی',
      hardware: 'برنجی آنتیک',
      features: ['کمد اسناد قفل‌دار', 'کتابخانه ۳ متری', 'میز مدیریت'],
      area: { value: 22, unit: 'متر مربع' },
      duration: '۴ هفته',
      location: 'تهران — ونک',
      isPublished: true,
    },
    {
      title: 'ست نشیمن با دیوارTV شیشه‌ای',
      shortDescription: 'دیوارTV شیشه‌ای با نورپردازی و ست مبل',
      fullDescription: 'دیوارTV با درب شیشه دودی و نور LED پشت شیشه، همراه با کابینت پایین و کنسول. طراحی مینیمال برای فضای نشیمن ۳۰ متری.',
      coverImage: img('d.jpg'),
      images: [img('d.jpg'), img('e.jpg')],
      category: living._id,
      style: 'modern',
      space: 'living',
      bodyMaterial: 'MDF',
      doorMaterial: 'شیشه دودی و MDF',
      hardware: 'دستگیره مخفی',
      features: ['نور LED پشت شیشه', 'کنترل از راه دور نور', 'فضای هدست مخفی'],
      area: { value: 8, unit: 'متر مربع' },
      duration: '۱۲ روز',
      location: 'تهران — سعادت‌آباد',
      isPublished: true,
    },
    {
      title: 'آشپزخانه کلاسیک ویلایی',
      shortDescription: 'نوسازی کامل آشپزخانه ویلا با کابینت کلاسیک',
      fullDescription: 'نوسازی کامل آشپزخانه ۲۵ متری ویلا در هشتگرد. تخریب کابینت قدیمی و ساخت کابینت کلاسیک با فرنیچ سفید، صفحه گرانیت و ستون‌های تزئینی. قبل و بعد پروژه در گالری قابل مشاهده است.',
      coverImage: img('q.jpg'),
      images: [img('q.jpg'), img('r.jpg')],
      beforeImage: img('r.jpg'),
      afterImage: img('q.jpg'),
      category: kitchen._id,
      style: 'classic',
      space: 'kitchen',
      bodyMaterial: 'MDF',
      doorMaterial: 'فرنیچ سفید',
      countertop: 'گرانیت',
      hardware: 'نجف‌کار کرم',
      features: ['ستون‌های تزئینی', 'کوسن پارچه روی کشوها', 'سینک کلاسیک'],
      area: { value: 25, unit: 'متر مربع' },
      duration: '۵ هفته',
      location: 'هشتگرد',
      isPublished: true,
    },
    {
      title: 'کمد ریلی و انباری (پیش‌نویس)',
      shortDescription: 'در حال تکمیل مستندسازی',
      category: wardrobe._id,
      style: 'neoclassical',
      space: 'closet',
      coverImage: img('e.jpg'),
      images: [img('e.jpg')],
      isPublished: false,
    },
  ]);

  // خدمات
  await CabinetService.create([
    {
      title: 'طراحی اختصاصی کابینت',
      description: 'طراحی کابینت متناسب با فضای شما و سلیقه‌تان',
      details: 'تیم طراحی ما پس از بازدید و اندازه‌گیری، چندین طرح سه‌بعدی را برای شما آماده می‌کند تا با دیدن نتیجه نهایی، بهترین انتخاب را داشته باشید.',
      image: img('c.jpg'),
      features: ['رندر سه‌بعدی رایگان', 'بازدید و اندازه‌گیری حضوری', 'طراحی اختصاصی'],
      sortOrder: 1,
    },
    {
      title: 'ساخت و اجرای کامل',
      description: 'ساخت کابینت در کارگاه و نصب دقیق در محل',
      details: 'تمام مراحل ساخت در کارگاه مجهز ما انجام می‌شود و تیم نصب با دقت میلی‌متری کابینت را در محل نصب می‌کند. ضمانت ۵ ساله ساخت همراه هر پروژه است.',
      image: img('a.jpg'),
      features: ['متریال درجه‌یک', 'ضمانت ۵ ساله', 'نصب دقیق و تمیز'],
      sortOrder: 2,
    },
    {
      title: 'نوسازی و بازسازی کابینت',
      description: 'تجدیدحیات کابینت قدیمی بدون هزینه ساخت کامل',
      details: 'اگر بدنه کابینت شما سالم است، می‌توان با تعویض درب‌ها، رنگ‌آمیزی و یراق‌آلات جدید، آشپزخانه را کاملاً متحول کرد — با هزینه‌ای بسیار کمتر از ساخت جدید.',
      image: img('r.jpg'),
      features: ['تعویض درب‌ها', 'رنگ‌آمیزی تخصصی', 'تعویض یراق‌آلات'],
      sortOrder: 3,
    },
    {
      title: 'نصب و راه‌اندازی تجهیزات',
      description: 'نصب اصولی تجهیزات برقی آشپزخانه',
      details: 'نصب فرد، هود، دستشویی، سینک و شیرآلات با رعایت اصول ایمنی و زیبایی. هماهنگی کامل سیم‌کشی و لوله‌کشی با کابینت.',
      image: img('f.jpg'),
      features: ['فرد و هود', 'دستشویی و سینک', 'شیرآلات'],
      sortOrder: 4,
    },
    {
      title: 'رنگ‌آمیزی و تغییر ظاهر',
      description: 'تغییر رنگ و ظاهر کابینت با رنگ‌های تخصصی',
      details: 'با رنگ‌های اسپری و پودری مخصوص کابینت، می‌توان رنگ قدیمی را تغییر داد یا خراش‌ها و آسیب‌ها را برطرف کرد. نتیجه نزدیک به کارخانه و بادوام.',
      image: img('x.jpg'),
      features: ['رنگ پودری و اسپری', 'رفع خراش و آسیب', 'چندین گزینه رنگ'],
      sortOrder: 5,
    },
    {
      title: 'خدمات پس از اجرا',
      description: 'همراه شما پس از تحویل پروژه',
      details: 'یک سال خدمات رایگان پس از نصب شامل تنظیم قفل‌ها، لولاها و کشوها. در طول این مدت هرگونه مشکل با یک تماس برطرف می‌شود.',
      image: img('s.jpg'),
      features: ['یک سال خدمات رایگان', 'پاسخ سریع', 'یراق یدکی در اختیار'],
      sortOrder: 6,
    },
  ]);

  // نظرات
  await Testimonial.create([
    {
      customerName: 'مریم احمدی',
      comment: 'از صفر تا صد آشپزخانه ما رو با حوصله و دقت ساختند. طرح سه‌بعدی از اول عالی بود و دقیقاً همون چیزی که دیدیم تحویل گرفتیم. کیفیت متریال واقعاً عالیه.',
      rating: 5,
      projectType: 'کابینت آشپزخانه',
      isApproved: true,
      sortOrder: 1,
    },
    {
      customerName: 'حسین کریمی',
      comment: 'کمد دیواری اتاق خواب رو سفارش دادیم. نصب تمیز و دقیق بود و از وقت گذاشتن برای تنظیم لولاها تعریف می‌کنم. قیمت هم منصفانه بود.',
      rating: 5,
      projectType: 'کمد دیواری',
      isApproved: true,
      sortOrder: 2,
    },
    {
      customerName: 'زهرا موسوی',
      comment: 'آشپزخانه قدیمیمون رو نوسازی کردن؛ بدون اینکه بدنه‌ها رو ببرن درب‌ها و رنگ عوض شد. حالا آشپزخونمون مثل نو شده. حتماً به بقیه هم پیشنهاد می‌دم.',
      rating: 4,
      projectType: 'نوسازی کابینت',
      isApproved: true,
      sortOrder: 3,
    },
    {
      customerName: 'علی رضایی',
      comment: 'جزیره آشپزخانه خیلی خوب اومد، دستشویی‌ها روان کار می‌کنن. فقط نصاب یه روز دیر رسید که باز هم مشکلی نبود.',
      rating: 4,
      projectType: 'جزیره آشپزخانه',
      isApproved: false,
    },
  ]);

  // سوالات متداول
  await Faq.create([
    {
      question: 'مدت زمان ساخت یک کابینت آشپزخانه چقدر است؟',
      answer: 'بسته به پیچیدگی طرح، معمولاً بین ۲ تا ۵ هفته زمان لازم است. زمان دقیق را پس از تأیید طرح نهایی، در قرارداد مشخص می‌کنیم.',
      sortOrder: 1,
    },
    {
      question: 'آیا بازدید و اندازه‌گیری هزینه دارد؟',
      answer: 'بازدید، اندازه‌گیری و ارائه طرح اولیه رایگان است. تنها در صورتی که طرح نهایی تأیید شود، هزینه طراحی سه‌بعدی از مبلغ کل کسر می‌شود.',
      sortOrder: 2,
    },
    {
      question: 'چه متریالی برای بدنه و درب کابینت استفاده می‌کنید؟',
      answer: 'بدنه معمولاً MDF یا MDF ضد آب است. درب‌ها بسته به سبک انتخابی، لمینت، اکیه، رنگ روغنی، فرنیچ یا چوب طبیعی خواهد بود. جزئیات متریال در قرارداد قید می‌شود.',
      sortOrder: 3,
    },
    {
      question: 'ضمانت ساخت کابینت چند سال است؟',
      answer: 'بدنه کابینت ۵ سال و یراق‌آلات ۱ سال ضمانت دارند. علاوه بر این یک سال خدمات رایگان نصب و تنظیم پس از تحویل دارید.',
      sortOrder: 4,
    },
    {
      question: 'آیا امکان نوسازی کابینت قدیمی بدون تخریب کامل وجود دارد؟',
      answer: 'بله، اگر بدنه کابینت سالم باشد، می‌توان با تعویض درب‌ها، رنگ‌آمیزی و تعویض یراق‌آلات، ظاهر آشپزخانه را با هزینه‌ای مناسب تغییر داد.',
      sortOrder: 5,
    },
    {
      question: 'نحوه پرداخت هزینه چگونه است؟',
      answer: 'معمولاً ۵۰٪ هنگام تأیید طرح، ۳۰٪ در مرحله ساخت و ۲۰٪ هنگام نصب و تحویل نهایی پرداخت می‌شود. شرایط دقیق در قرارداد مشخص است.',
      sortOrder: 6,
    },
  ]);

  } // ---- پایان بلوک داده‌های نمونه ----

  if (seededSample) {
    console.log('[seed] داده‌های نمونه درج شد (۶ دسته، ۹ پروژه، ۶ خدمت، ۴ نظر، ۶ سوال).');
  }

  /* ================= 3. تنظیمات سایت (فقط در صورتی که وجود نداشته باشد) ================= */
  const existingSettings = await SiteSettings.findById('singleton');
  if (!existingSettings) {
    await SiteSettings.findByIdAndUpdate(
      'singleton',
      {
        $set: {
        siteName: 'عزیزی کابینت',
        shortDescription: 'طراحی و اجرای کابینت با متریال درجه‌یک، طراحی اختصاصی متناسب با سلیقه شما و اجرای دقیق؛ همراه مطمئن شما برای ساخت فضایی زیبا و ماندگار.',
        phone: '09121234567',
        whatsapp: '989121234567',
        email: 'info@ezazi-cabinet.ir',
        address: 'تهران، خیابان نمونه، پلاک ۱۲',
        mapLink: 'https://maps.google.com/?q=Tehran',
        workHours: 'شنبه تا پنج‌شنبه، ۹:۰۰ تا ۱۸:۰۰',
        instagram: 'https://instagram.com/cabinet.sazan',
        telegram: 'https://t.me/cabinet_sazan',
        about: {
          longText: 'مجموعه عزیزی کابینت با بیش از یک دهه تجربه در طراحی و اجرای کابینت، یکی از نام‌های شناخته‌شده در این حوزه است. ما با تیمی از طراحان مهندسی و استادکاران باتجربه، از مرحله مشاوره تا نصب نهایی در کنار شما هستیم. شعار ما ساده است: کابینی بسازیم که سال‌ها بدون دغدغه استفاده کنید.',
          experienceYears: 12,
          strengths: ['بیش از ۱۲ سال تجربه', 'تیم طراحی و مهندسی اختصاصی', 'متریال درجه‌یک با ضمانت', 'تحویل به‌موقع پروژه', 'خدمات پس از فروش قوی'],
          values: ['کیفیت در همه‌ی جزئیات', 'شفافیت در قیمت و قرارداد', 'رضایت مشتری اولویت اول', 'نوآوری در طراحی'],
        },
        home: {
          heroTitle: 'طراحی کابینت مطابق سلیقه شما',
          heroSubtitle: 'طراحی و اجرای کابینت',
          heroDescription: 'با ترکیب هنر، کیفیت و متریال روز دنیا، کابینتی متناسب با فضای خانه و سبک زندگی شما طراحی و اجرا می‌کنیم.',
          heroImage: img('bg-Home.jpg'),
          whyUs: [
            { title: 'طراحی اختصاصی', description: 'طراحی متناسب با فضای آشپزخانه و سلیقه شما.', icon: 'pi pi-pencil' },
            { title: 'کیفیت بالا', description: 'استفاده از متریال باکیفیت و یراق‌آلات مناسب.', icon: 'pi pi-star' },
            { title: 'اجرای دقیق', description: 'اجرای اصولی و دقیق با توجه به جزئیات پروژه.', icon: 'pi pi-wrench' },
            { title: 'مشاوره رایگان', description: 'برای انتخاب مدل، رنگ و متریال در کنار شما هستیم.', icon: 'pi pi-comments' },
          ],
          steps: [
            { title: 'مشاوره و استعلام', description: 'ثبت درخواست و هماهنگی بازدید رایگان' },
            { title: 'اندازه‌گیری و طراحی', description: 'بازدید، اندازه‌گیری و ارائه رندر سه‌بعدی' },
            { title: 'ساخت در کارگاه', description: 'ساخت کابینت با متریال درجه‌یک' },
            { title: 'نصب و تحویل', description: 'نصب دقیق در محل و تحویل پروژه' },
          ],
        },
      },
    },
        { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' }
      );
      console.log('[seed] تنظیمات سایت درج شد.');
    }
}

/* ================= اجرای دستی ================= */
if (require.main === module) {
  (async () => {
    const { connectDB, disconnectDB } = require('../database/db');
    try {
      await connectDB();
      await seedDatabase();
      console.log('[seed] کامل شد.');
    } catch (err) {
      console.error('[seed] خطا در seed:', err);
      process.exitCode = 1;
    } finally {
      await disconnectDB();
    }
  })();
}

module.exports = { seedDatabase };
