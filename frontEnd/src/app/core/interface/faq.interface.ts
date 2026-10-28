/**
 * سؤال متداول
 */
export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
