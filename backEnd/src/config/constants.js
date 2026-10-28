/**
 * ثابتها و enumهای مشترک API
 */
module.exports = {
  /** سبک‌های کابینت */
  PROJECT_STYLES: ['modern', 'neoclassical', 'classic'],

  /** فضای اجرا */
  PROJECT_SPACES: ['kitchen', 'wardrobe', 'closet', 'island', 'office', 'living'],

  /** وضعیت درخواست مشاوره */
  CONSULTATION_STATUSES: ['new', 'in-progress', 'completed', 'cancelled'],

  /** وضعیت پیام تماس */
  CONTACT_STATUSES: ['new', 'answered'],

  /** فرمت شماره موبایل ایران */
  PHONE_REGEX: /^09\d{9}$/,

  /** محدودیت‌های پیش‌فرض صفحه‌بندی */
  PAGING: {
    defaultLimit: 12,
    maxLimit: 100,
  },
};
