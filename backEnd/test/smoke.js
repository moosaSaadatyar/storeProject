/**
 * تست دود (smoke test) API — همه endpointهای عمومی و مدیریتی
 * اجرا: node test/smoke.js
 */
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';

/** رمز مدیر از .env خوانده می‌شود تا با محیط توسعه هم‌خوان باشد */
function readAdminPassword() {
  try {
    const txt = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const m = txt.match(/^ADMIN_PASSWORD=(.+)$/m);
    if (m) return m[1].trim();
  } catch (e) {
    /* .env موجود نیست — مقدار پیش‌فرض */
  }
  return 'Admin1234!';
}
const ADMIN_PASSWORD = readAdminPassword();

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ✘ ${name} — ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function getJson(path, headers = {}) {
  const res = await fetch(BASE + path, { headers });
  const body = await res.json();
  return { status: res.status, body };
}

(async () => {
  console.log('\n== عمومی ==');

  let token = null;
  let firstProject = null;

  await check('GET /api/health', async () => {
    const { status, body } = await getJson('/api/health');
    assert(status === 200 && body.success === true, `status=${status}`);
  });

  await check('GET /api/projects (لیست + صفحه‌بندی)', async () => {
    const { status, body } = await getJson('/api/projects?page=1&limit=5');
    assert(status === 200 && body.success === true, `status=${status}`);
    assert(Array.isArray(body.data.items) && body.data.items.length > 0, 'items خالی');
    assert(typeof body.data.total === 'number' && body.data.total > 0, 'total نامعتبر');
    assert(body.data.totalPages >= 1, 'totalPages نامعتبر');
    assert(body.data.items[0].category && body.data.items[0].category.name, 'category populate نشد');
    firstProject = body.data.items[0];
  });

  await check('GET /api/projects?category=kitchen-cabinet', async () => {
    const { status, body } = await getJson('/api/projects?category=kitchen-cabinet');
    assert(status === 200 && body.success, `status=${status}`);
    for (const p of body.data.items) {
      assert(p.category.slug === 'kitchen-cabinet', 'فیلتر category کار نمی‌کند');
    }
  });

  await check('GET /api/projects?style=modern&space=kitchen', async () => {
    const { status, body } = await getJson('/api/projects?style=modern&space=kitchen');
    assert(status === 200 && body.success, `status=${status}`);
    for (const p of body.data.items) {
      assert(p.style === 'modern' && p.space === 'kitchen', 'فیلترها کار نمی‌کنند');
    }
  });

  await check('GET /api/projects?featured=true', async () => {
    const { status, body } = await getJson('/api/projects?featured=true');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.items.length > 0, 'پروژه منتخبی نیست');
    for (const p of body.data.items) assert(p.isFeatured === true, 'فیلتر featured کار نمی‌کند');
  });

  await check('GET /api/projects?q=آشپزخانه (جست‌وجو)', async () => {
    const { status, body } = await getJson('/api/projects?q=' + encodeURIComponent('آشپزخانه'));
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.total > 0, 'نتیجه جست‌وجو خالی');
  });

  await check('GET /api/projects/:id (جزئیات + related)', async () => {
    const { status, body } = await getJson(`/api/projects/${firstProject._id}`);
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.title, 'عنوان ندارد');
    assert(Array.isArray(body.data.related), 'related نیست');
    assert(body.data.related.length <= 4, 'related بیش از ۴');
  });

  await check('GET /api/projects (پروژه‌ی پیش‌نویس نمایش داده نشود)', async () => {
    const { body } = await getJson('/api/projects?limit=100');
    for (const p of body.data.items) {
      assert(p.isPublished === true, 'پروژه پیش‌نویس در لیست عمومی است!');
    }
  });

  await check('GET /api/categories', async () => {
    const { status, body } = await getJson('/api/categories');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.length === 6, `انتظار ۶ دسته، ${body.data.length} دریافت شد`);
    assert(typeof body.data[0].projectCount === 'number', 'projectCount نیست');
  });

  await check('GET /api/services', async () => {
    const { status, body } = await getJson('/api/services');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.length === 6, `انتظار ۶ خدمت، ${body.data.length} دریافت شد`);
  });

  await check('GET /api/testimonials (فقط تأییدشده)', async () => {
    const { status, body } = await getJson('/api/testimonials');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.length >= 3, `انتظار حداقل ۳ نظر تأییدشده، ${body.data.length} دریافت شد`);
    for (const t of body.data) assert(t.isApproved === true, 'نظر تأییدنشده نمایش داده شده');
  });

  await check('GET /api/faqs', async () => {
    const { status, body } = await getJson('/api/faqs');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.length === 6, `انتظار ۶ سوال، ${body.data.length} دریافت شد`);
  });

  await check('GET /api/settings/public', async () => {
    const { status, body } = await getJson('/api/settings/public');
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.siteName, 'siteName نیست');
    assert(body.data.home && body.data.home.whyUs.length === 4, 'home.whyUs نیست');
    assert(body.data.home.steps.length === 4, 'home.steps نیست');
  });

  await check('POST /api/contact (JSON)', async () => {
    const res = await fetch(BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'تست تماس',
        phone: '09121112233',
        subject: 'درخواست قیمت',
        message: 'پیام تستی',
      }),
    });
    const body = await res.json();
    assert(res.status === 201 && body.success, `status=${res.status} ${body.message}`);
  });

  await check('POST /api/contact (شماره نامعتبر → 400)', async () => {
    const res = await fetch(BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'تست', phone: '123', message: 'x' }),
    });
    assert(res.status === 400, `status=${res.status}`);
  });

  await check('POST /api/testimonials (عمومی → isApproved=false)', async () => {
    const comment = `نظر تستی ${Date.now()}`;
    const res = await fetch(BASE + '/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: 'مهمان', comment, rating: 5 }),
    });
    const body = await res.json();
    assert(res.status === 201 && body.success, `status=${res.status}`);
    const list = await getJson('/api/testimonials');
    assert(!list.body.data.find((t) => t.comment === comment), 'نظر عمومی نباید نمایش داده شود');
  });

  console.log('\n== احراز هویت ==');

  await check('POST /api/admin/login', async () => {
    const res = await fetch(BASE + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cabinet.ir', password: ADMIN_PASSWORD }),
    });
    const body = await res.json();
    assert(res.status === 200 && body.success, `status=${res.status} ${body.message}`);
    assert(body.data.token, 'توکن نیست');
    assert(body.data.admin.email === 'admin@cabinet.ir', 'اطلاعات مدیر نیست');
    token = body.data.token;
  });

  await check('POST /api/admin/login (رمز اشتباه → 401)', async () => {
    const res = await fetch(BASE + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cabinet.ir', password: 'wrong' }),
    });
    assert(res.status === 401, `status=${res.status}`);
  });

  const authHeaders = { Authorization: `Bearer ${token}` };

  await check('GET /api/admin/me', async () => {
    const { status, body } = await getJson('/api/admin/me', authHeaders);
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.email === 'admin@cabinet.ir', 'ایمیل مدیر نامعتبر');
  });

  await check('GET /api/admin/dashboard/stats', async () => {
    const { status, body } = await getJson('/api/admin/dashboard/stats', authHeaders);
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.projects.total === 9, `projects.total=${body.data.projects.total}`);
    assert(body.data.consultations.new >= 0, 'آمار مشاوره نیست');
    assert(Array.isArray(body.data.recentConsultations), 'recentConsultations نیست');
  });

  await check('endpoint مدیریتی بدون توکن → 401', async () => {
    const { status } = await getJson('/api/admin/projects');
    assert(status === 401, `status=${status}`);
  });

  console.log('\n== مدیریت پروژه‌ها ==');

  let newProjectId = null;

  await check('POST /api/admin/projects (multipart با تصویر)', async () => {
    const form = new FormData();
    form.append('title', 'پروژه تستی آپلود');
    form.append('shortDescription', 'توضیح تست');
    form.append('category', (await getJson('/api/categories', authHeaders)).body.data[0]._id);
    form.append('style', 'modern');
    form.append('space', 'kitchen');
    form.append('isFeatured', 'false');
    form.append('isPublished', 'false');
    // ساخت یک PNG کوچک (1x1)
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    form.append('coverImage', new Blob([pngBytes], { type: 'image/png' }), 'test.png');
    form.append('_uploadDir', 'projects');

    const res = await fetch(BASE + '/api/admin/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const body = await res.json();
    assert(res.status === 201 && body.success, `status=${res.status} ${body.message}`);
    assert(body.data.coverImage.startsWith('/uploads/'), 'کاور آپلود نشده');
    newProjectId = body.data._id;
  });

  await check('GET /api/admin/projects (شامل پیش‌نویس)', async () => {
    const { status, body } = await getJson('/api/admin/projects?q=' + encodeURIComponent('تستی'), authHeaders);
    assert(status === 200 && body.success, `status=${status}`);
    assert(body.data.items.some((p) => p._id === newProjectId), 'پروژه جدید در لیست نیست');
  });

  await check('PUT /api/admin/projects/:id', async () => {
    const res = await fetch(`${BASE}/api/admin/projects/${newProjectId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'پروژه تستی ویرایش‌شده', isPublished: true }),
    });
    const body = await res.json();
    assert(res.status === 200 && body.success, `status=${res.status} ${body.message}`);
    assert(body.data.title === 'پروژه تستی ویرایش‌شده', 'ویرایش انجام نشده');
  });

  await check('DELETE /api/admin/projects/:id', async () => {
    const res = await fetch(`${BASE}/api/admin/projects/${newProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    assert(res.status === 200 && body.success, `status=${res.status}`);
  });

  console.log('\n== مدیریت سایر ماژول‌ها ==');

  await check('CRUD categories (ساخت + حذف)', async () => {
    const form = new FormData();
    form.append('name', 'دسته تستی');
    form.append('description', 'تست');
    const createRes = await fetch(BASE + '/api/admin/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const createBody = await createRes.json();
    assert(createRes.status === 201, `status=${createRes.status} ${createBody.message}`);
    const catId = createBody.data._id;
    assert(createBody.data.slug, 'slug ساخته نشده');

    const delRes = await fetch(`${BASE}/api/admin/categories/${catId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delRes.status === 200, `status=${delRes.status}`);
  });

  await check('CRUD faqs (ساخت + ویرایش + حذف)', async () => {
    const createRes = await fetch(BASE + '/api/admin/faqs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'سوال تستی؟', answer: 'پاسخ تستی', sortOrder: 99 }),
    });
    const createBody = await createRes.json();
    assert(createRes.status === 201, `status=${createRes.status}`);
    const faqId = createBody.data._id;

    const updRes = await fetch(`${BASE}/api/admin/faqs/${faqId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: 'پاسخ ویرایش‌شده' }),
    });
    const updBody = await updRes.json();
    assert(updRes.status === 200 && updBody.data.answer === 'پاسخ ویرایش‌شده', 'ویرایش نشد');

    const delRes = await fetch(`${BASE}/api/admin/faqs/${faqId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delRes.status === 200, `status=${delRes.status}`);
  });

  await check('consultations: ثبت عمومی (multipart) + لیست مدیر + تغییر وضعیت', async () => {
    const form = new FormData();
    form.append('fullName', 'مشتری تستی');
    form.append('phone', '09123334455');
    form.append('cabinetType', 'kitchen');
    form.append('style', 'modern');
    form.append('city', 'تهران');
    form.append('description', 'درخواست تستی');
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    form.append('files', new Blob([pngBytes], { type: 'image/png' }), 'photo.png');

    const createRes = await fetch(BASE + '/api/consultations', { method: 'POST', body: form });
    const createBody = await createRes.json();
    assert(createRes.status === 201 && createBody.success, `status=${createRes.status} ${createBody.message}`);

    const listRes = await getJson('/api/admin/consultations?status=new', authHeaders);
    const item = listRes.body.data.items.find((c) => c.fullName === 'مشتری تستی');
    assert(item, 'درخواست جدید در لیست مدیر نیست');
    assert(item.files.length === 1, 'فایل آپلود نشده');

    const updRes = await fetch(`${BASE}/api/admin/consultations/${item._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in-progress', adminNote: 'در حال پیگیری' }),
    });
    const updBody = await updRes.json();
    assert(updRes.status === 200 && updBody.data.status === 'in-progress', 'تغییر وضعیت نشد');
  });

  await check('contact: لیست مدیر + وضعیت answered', async () => {
    const listRes = await getJson('/api/admin/contact', authHeaders);
    assert(listRes.status === 200, `status=${listRes.status}`);
    const msg = listRes.body.data.items.find((m) => m.fullName === 'تست تماس');
    assert(msg, 'پیام تستی در لیست نیست');

    const updRes = await fetch(`${BASE}/api/admin/contact/${msg._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'answered' }),
    });
    assert(updRes.status === 200, `status=${updRes.status}`);
  });

  await check('testimonials: تأیید نظر در انتظار', async () => {
    const listRes = await getJson('/api/admin/testimonials?isApproved=false', authHeaders);
    assert(listRes.body.data.items.length >= 1, 'نظری در انتظار نیست');
    const pending = listRes.body.data.items[0];

    const updRes = await fetch(`${BASE}/api/admin/testimonials/${pending._id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: true }),
    });
    const updBody = await updRes.json();
    assert(updRes.status === 200 && updBody.data.isApproved === true, 'تأیید نشد');
  });

  await check('settings: GET + PUT (admin)', async () => {
    const getRes = await getJson('/api/admin/settings', authHeaders);
    assert(getRes.status === 200 && getRes.body.data.siteName, 'تنظیمات نیست');

    const form = new FormData();
    form.append('workHours', 'شنبه تا چهارشنبه ۹ تا ۱۸');
    form.append('home.heroTitle', 'عنوان بنر جدید');
    const putRes = await fetch(BASE + '/api/admin/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const putBody = await putRes.json();
    assert(putRes.status === 200 && putBody.data.workHours === 'شنبه تا چهارشنبه ۹ تا ۱۸', 'ذخیره نشد');
  });

  await check('POST /api/admin/upload (آپلود مستقل)', async () => {
    const form = new FormData();
    form.append('_uploadDir', 'general');
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    form.append('files', new Blob([pngBytes], { type: 'image/png' }), 'a.png');
    form.append('files', new Blob([pngBytes], { type: 'image/png' }), 'b.png');

    const res = await fetch(BASE + '/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const body = await res.json();
    assert(res.status === 200 && body.data.length === 2, `status=${res.status}`);
    assert(body.data[0].url.startsWith('/uploads/'), 'URL اشتباه');

    // سرو استاتیک
    const imgRes = await fetch(BASE + body.data[0].url);
    assert(imgRes.status === 200, 'فایل استاتیک سرو نمی‌شود');
  });

  await check('404 برای مسیر ناموجود', async () => {
    const res = await fetch(BASE + '/api/nonexistent');
    const body = await res.json();
    assert(res.status === 404 && body.success === false, `status=${res.status}`);
  });

  console.log(`\n== نتیجه: ${passed} موفق، ${failed} ناموفق ==\n`);
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error('خطای فATAL در تست:', err);
  process.exit(1);
});
