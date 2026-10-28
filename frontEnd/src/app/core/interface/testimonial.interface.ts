/**
 * نظر مشتری
 */
export interface ITestimonial {
  _id: string;
  customerName?: string;
  comment: string;
  rating?: number;
  projectType?: string;
  isApproved: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt?: string;
}
