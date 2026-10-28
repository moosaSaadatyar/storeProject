import { inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

/**
 * گارد صفحه‌ی ورود — اگر مدیر وارد شده باشد به داشبورد هدایت می‌شود
 */
@Injectable({ providedIn: 'root' })
export class BlockAuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      return this.router.parseUrl('/admin/dashboard');
    }
    return true;
  }
}
