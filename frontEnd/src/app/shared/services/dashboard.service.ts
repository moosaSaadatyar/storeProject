import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IConsultation } from '../../core/interface/consultation.interface';
import { IDashboardStats } from '../../core/interface/admin.interface';

/**
 * سرویس داشبورد پنل مدیریت
 */
@Injectable({ providedIn: 'root' })
export class DashboardService extends CabinetApiService {
  /** آمار کلی پنل */
  stats(): Observable<IDashboardStats> {
    return this.get<IDashboardStats>('/admin/dashboard/stats');
  }

  /** آخرین درخواست‌های مشاوره (برای نمایش سریع) */
  recentConsultations(): Observable<IConsultation[]> {
    return this.get<IConsultation[]>('/admin/consultations', { limit: 5 });
  }
}
