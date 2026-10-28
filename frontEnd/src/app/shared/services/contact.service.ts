import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { IContactMessage } from '../../core/interface/contact.interface';

/**
 * سرویس پیام‌های تماس
 */
@Injectable({ providedIn: 'root' })
export class ContactService extends CabinetApiService {
  /** ثبت عمومی (JSON) */
  create(body: { fullName: string; phone: string; email?: string; subject?: string; message: string }): Observable<{ id: string }> {
    return this.post<{ id: string }>('/contact', body);
  }

  /* مدیریتی */
  adminList(params: { status?: string; page?: number; limit?: number } = {}): Observable<IPagedResult<IContactMessage>> {
    return this.get<IPagedResult<IContactMessage>>('/admin/contact', params);
  }

  adminUpdateStatus(id: string, status: 'new' | 'answered'): Observable<IContactMessage> {
    return this.put<IContactMessage>(`/admin/contact/${id}/status`, { status });
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/contact/${id}`);
  }
}
