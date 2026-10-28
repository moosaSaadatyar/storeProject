/**
 * شکل استاندارد پاسخ API
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  code?: string;
  errors?: string[];
}

/**
 * پاسخ‌های صفحه‌بندی‌شده
 */
export interface IPagedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * نتیجه آپلود فایل (POST /api/admin/upload)
 */
export interface IUploadedImage {
  name: string;
  url: string;
}
