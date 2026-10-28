/**
 * خدمت کابینت‌سازی
 */
export interface ICabinetService {
  _id: string;
  title: string;
  description?: string;
  details?: string;
  image?: string;
  features: string[];
  sortOrder?: number;
  isActive: boolean;
}
