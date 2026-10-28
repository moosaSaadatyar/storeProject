/**
 * پیام تماس
 */
export interface IContactMessage {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: 'new' | 'answered';
  createdAt: string;
  updatedAt?: string;
}
