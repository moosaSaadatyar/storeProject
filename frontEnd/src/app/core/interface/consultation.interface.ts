/**
 * وضعیت درخواست مشاوره
 */
export const CONSULTATION_STATUSES = ['new', 'in-progress', 'completed', 'cancelled'] as const;
export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

/**
 * درخواست مشاوره و برآورد قیمت
 */
export interface IConsultation {
  _id: string;
  fullName: string;
  phone: string;
  serviceType?: string;
  cabinetType?: string;
  style?: string;
  color?: string;
  dimensions?: string;
  city?: string;
  budget?: string;
  description?: string;
  files: string[];
  status: ConsultationStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}
