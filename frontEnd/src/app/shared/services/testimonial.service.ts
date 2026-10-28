import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { ITestimonial } from '../../core/interface/testimonial.interface';

/**
 * سرویس نظرات مشتریان
 */
@Injectable({ providedIn: 'root' })
export class TestimonialService extends CabinetApiService {
  /* عمومی — فقط موارد تأییدشده */
  list(): Observable<ITestimonial[]> {
    return this.get<ITestimonial[]>('/testimonials');
  }

  /** ثبت عمومی نظر (isApproved=false) */
  create(body: { customerName?: string; comment: string; rating?: number; projectType?: string }): Observable<{ id: string }> {
    return this.post<{ id: string }>('/testimonials', body);
  }

  /* مدیریتی */
  adminList(params: { isApproved?: boolean; page?: number; limit?: number } = {}): Observable<IPagedResult<ITestimonial>> {
    return this.get<IPagedResult<ITestimonial>>('/admin/testimonials', params);
  }

  adminCreate(body: Partial<ITestimonial>): Observable<ITestimonial> {
    return this.post<ITestimonial>('/admin/testimonials', body);
  }

  adminUpdate(id: string, body: Partial<ITestimonial>): Observable<ITestimonial> {
    return this.put<ITestimonial>(`/admin/testimonials/${id}`, body);
  }

  adminApprove(id: string, isApproved: boolean): Observable<ITestimonial> {
    return this.put<ITestimonial>(`/admin/testimonials/${id}/approve`, { isApproved });
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/testimonials/${id}`);
  }
}
