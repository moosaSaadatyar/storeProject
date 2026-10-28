import { ICategory } from './category.interface';

/**
 * وضعیت‌های سبک کابینت
 */
export const PROJECT_STYLES = ['modern', 'neoclassical', 'classic'] as const;
export type ProjectStyle = (typeof PROJECT_STYLES)[number];

/**
 * فضای اجرا
 */
export const PROJECT_SPACES = ['kitchen', 'wardrobe', 'closet', 'island', 'office', 'living'] as const;
export type ProjectSpace = (typeof PROJECT_SPACES)[number];

export interface IProjectArea {
  value: number;
  unit: string;
}

/**
 * پروژه / نمونه‌کار کابینت
 */
export interface IProject {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  coverImage: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  category: ICategory | string;
  style?: ProjectStyle | null;
  space?: ProjectSpace | null;
  bodyMaterial?: string;
  doorMaterial?: string;
  countertop?: string;
  hardware?: string;
  features: string[];
  area?: IProjectArea;
  duration?: string;
  location?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  /** در پاسخ جزئیات: پروژه‌های هم‌دسته */
  related?: IProject[];
}

/**
 * پارامترهای فیلتر لیست عمومی پروژه‌ها
 */
export interface IProjectFilterParams {
  category?: string; // slug
  style?: string;
  space?: string;
  featured?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}
