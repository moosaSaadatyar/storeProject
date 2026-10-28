import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../public/envierments/envierments';
import { IAdmin } from '../../interface/admin.interface';
import { IApiResponse } from '../../interface/api.interface';

const TOKEN_KEY = 'cabinet-admin-token';
const ADMIN_KEY = 'cabinet-admin';

/**
 * احراز هویت مدیر — توکن در localStorage
 * (ردIRECT و پیام خطای 401 توسط error.interceptor مدیریت می‌شود)
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly token = signal<string | null>(this.readToken());
  readonly admin = signal<IAdmin | null>(this.readAdmin());
  readonly isAuthenticated = computed(() => !!this.token());

  /**
   * ورود مدیر — توکن و اطلاعات مدیر ذخیره می‌شود
   */
  login(email: string, password: string): Observable<IAdmin> {
    return this.http
      .post<IApiResponse<{ token: string; admin: IAdmin }>>(`${environment.apiUrl}/api/admin/login`, {
        email,
        password,
      })
      .pipe(
        map((res) => {
          this.token.set(res.data.token);
          this.admin.set(res.data.admin);
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(ADMIN_KEY, JSON.stringify(res.data.admin));
          return res.data.admin;
        })
      );
  }

  /**
   * خروج — پاک‌سازی توکن و اطلاعات مدیر
   */
  logout(): void {
    this.token.set(null);
    this.admin.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  }

  private readToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readAdmin(): IAdmin | null {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      return raw ? (JSON.parse(raw) as IAdmin) : null;
    } catch {
      return null;
    }
  }
}
