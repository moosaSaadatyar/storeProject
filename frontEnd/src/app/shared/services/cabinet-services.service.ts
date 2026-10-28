import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { ICabinetService } from '../../core/interface/service.interface';

/**
 * سرویس خدمات کابینت‌سازی
 */
@Injectable({ providedIn: 'root' })
export class CabinetServicesService extends CabinetApiService {
  /* عمومی */
  list(): Observable<ICabinetService[]> {
    return this.get<ICabinetService[]>('/services');
  }

  /* مدیریتی */
  adminList(params: { page?: number; limit?: number } = {}): Observable<IPagedResult<ICabinetService>> {
    return this.get<IPagedResult<ICabinetService>>('/admin/services', params);
  }

  adminCreate(formData: FormData): Observable<ICabinetService> {
    return this.post<ICabinetService>('/admin/services', formData);
  }

  adminUpdate(id: string, formData: FormData): Observable<ICabinetService> {
    return this.put<ICabinetService>(`/admin/services/${id}`, formData);
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/services/${id}`);
  }
}
