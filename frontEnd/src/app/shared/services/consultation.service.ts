import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { IConsultation } from '../../core/interface/consultation.interface';

/**
 * سرویس درخواست‌های مشاوره
 */
@Injectable({ providedIn: 'root' })
export class ConsultationService extends CabinetApiService {
  /** ثبت عمومی (multipart — با فایل‌های تصاویر) */
  create(formData: FormData): Observable<{ id: string }> {
    return this.post<{ id: string }>('/consultations', formData);
  }

  /* مدیریتی */
  adminList(params: { status?: string; page?: number; limit?: number } = {}): Observable<IPagedResult<IConsultation>> {
    return this.get<IPagedResult<IConsultation>>('/admin/consultations', params);
  }

  adminGetById(id: string): Observable<IConsultation> {
    return this.get<IConsultation>(`/admin/consultations/${id}`);
  }

  adminUpdateStatus(id: string, body: { status: string; adminNote?: string }): Observable<IConsultation> {
    return this.put<IConsultation>(`/admin/consultations/${id}/status`, body);
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/consultations/${id}`);
  }
}
