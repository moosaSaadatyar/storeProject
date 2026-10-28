import { IConsultation } from './consultation.interface';

/**
 * اطلاعات مدیر (بدون رمز عبور)
 */
export interface IAdmin {
  id: string;
  name: string;
  email: string;
}

/**
 * آمار داشبورد پنل مدیریت
 */
export interface IDashboardStats {
  projects: { total: number; published: number; featured: number };
  categories: { total: number };
  services: { total: number };
  consultations: {
    total: number;
    new: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  contactMessages: { total: number; new: number };
  testimonials: { total: number; pending: number };
  recentConsultations: IConsultation[];
}
