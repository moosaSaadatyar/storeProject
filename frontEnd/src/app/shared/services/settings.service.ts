import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { ISiteSettings } from '../../core/interface/settings.interface';

/**
 * سرویس تنظیمات سایت
 */
@Injectable({ providedIn: 'root' })
export class SettingsService extends CabinetApiService {
  /** تنظیمات عمومی (هدر/فوتر/خانه) */
  getPublic(): Observable<ISiteSettings> {
    return this.get<ISiteSettings>('/settings/public');
  }

  /* مدیریتی */
  adminGet(): Observable<ISiteSettings> {
    return this.get<ISiteSettings>('/admin/settings');
  }

  /** ذخیره — multipart برای لوگو، بقیه فیلدها text */
  adminUpdate(formData: FormData): Observable<ISiteSettings> {
    return this.put<ISiteSettings>('/admin/settings', formData);
  }
}
