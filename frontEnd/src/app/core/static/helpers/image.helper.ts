import { environment } from '../../../../../public/envierments/envierments';

/**
 * تبدیل مسیرهای ذخیره‌شده‌ی API به URL قابل نمایش:
 * - مسیرهای /uploads/... با apiUrl سرور کامل می‌شوند
 * - URLهای کامل (http/https/data) بدون تغییر باقی می‌مانند
 * - مسیرهای نسبی دیگر بدون تغییر (در dev توسط dev-server سرو می‌شوند)
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${environment.apiUrl}${trimmed}`;
  }

  return trimmed;
}

/** تصویر جایگزین وقتی تصویر موجود نیست */
export const PLACEHOLDER_IMAGE = '/images/z.jpg';
