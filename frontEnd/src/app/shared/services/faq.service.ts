import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { IFaq } from '../../core/interface/faq.interface';

/**
 * سرویس سوالات متداول
 */
@Injectable({ providedIn: 'root' })
export class FaqService extends CabinetApiService {
  /* عمومی — فقط سوالات فعال */
  list(): Observable<IFaq[]> {
    return this.get<IFaq[]>('/faqs');
  }

  /* مدیریتی */
  adminList(params: { page?: number; limit?: number } = {}): Observable<IPagedResult<IFaq>> {
    return this.get<IPagedResult<IFaq>>('/admin/faqs', params);
  }

  adminCreate(body: { question: string; answer: string; sortOrder?: number; isActive?: boolean }): Observable<IFaq> {
    return this.post<IFaq>('/admin/faqs', body);
  }

  adminUpdate(id: string, body: Partial<IFaq>): Observable<IFaq> {
    return this.put<IFaq>(`/admin/faqs/${id}`, body);
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/faqs/${id}`);
  }
}
