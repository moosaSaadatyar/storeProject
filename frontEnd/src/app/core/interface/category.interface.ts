/**
 * دسته‌بندی کابینت
 */
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  sortOrder?: number;
  isActive: boolean;
  /** فقط در پاسخ لیست عمومی */
  projectCount?: number;
}
