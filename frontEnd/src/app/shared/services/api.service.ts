import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../public/envierments/envierments';
import { IApiResponse } from '../../core/interface/api.interface';

/**
 * پایه‌ی خدمات API — همه‌ی سرویس‌های سایت از این کلاس می‌ورث می‌کنند
 * قرارداد پاسخ: { success, message, data } — خروجی متدها فقط بخش data است
 */
@Injectable({ providedIn: 'root' })
export class CabinetApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  /** تبدیل آبجکت پارامترها به HttpParams (مقادیر خالی حذف می‌شوند) */
  protected toParams(params?: Record<string, string | number | boolean | undefined>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }
    return httpParams;
  }

  get<T>(url: string, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    return this.http
      .get<IApiResponse<T>>(`${this.baseUrl}${url}`, { params: this.toParams(params) })
      .pipe(map((res) => res.data));
  }

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.http
      .post<IApiResponse<T>>(`${this.baseUrl}${url}`, body)
      .pipe(map((res) => res.data));
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.http
      .put<IApiResponse<T>>(`${this.baseUrl}${url}`, body)
      .pipe(map((res) => res.data));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<IApiResponse<T>>(`${this.baseUrl}${url}`)
      .pipe(map((res) => res.data));
  }
}
