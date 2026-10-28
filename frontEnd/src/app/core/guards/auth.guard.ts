import { inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

/**
 * گارد دسترسی پنل مدیریت — بدون توکن معتبر به صفحه‌ی ورود هدایت می‌شود
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    return this.router.parseUrl('/admin/login');
  }
}
