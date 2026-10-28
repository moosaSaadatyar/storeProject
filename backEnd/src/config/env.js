/**
 * بارگذاری و اعتبارسنجی متغیرهای محیطی.
 * باید قبل از هر چیز دیگری require شود.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const devDefaults = {
  PORT: '3000',
  MONGO_URI: '',
  JWT_SECRET: 'dev-secret-please-change-in-production',
  JWT_EXPIRES_IN: '12h',
  CORS_ORIGIN: 'http://localhost:4200',
  MAX_FILE_SIZE_MB: '5',
  MAX_FILES_PER_UPLOAD: '8',
  ADMIN_EMAIL: 'admin@cabinet.ir',
  ADMIN_PASSWORD: 'Admin1234!',
  SEED_SAMPLE_DATA: 'true',
};

for (const [key, value] of Object.entries(devDefaults)) {
  if (process.env[key] === undefined || process.env[key] === '') {
    process.env[key] = value;
  }
}

if (process.env.JWT_SECRET === devDefaults.JWT_SECRET) {
  console.warn('[env] هشدار: JWT_SECRET مقدار پیش‌فرض توسعه است؛ برای تولید حتماً مقدار آن را در .env تغییر دهید.');
}
if (!process.env.MONGO_URI) {
  console.warn('[env] MONGO_URI تنظیم نشده — در محیط توسعه از MongoDB درون‌حافظه‌ای استفاده می‌شود (داده‌ها با ری‌استارت پاک می‌شوند).');
}
