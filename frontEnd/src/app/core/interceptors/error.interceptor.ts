import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth/auth.service';

/**
 * اینترسپتر خطا — نمایش پیام خطای استاندارد API
 * - 401 روی endpointهای مدیریتی: پاک‌سازی توکن + ریدایرکت به صفحه‌ی ورود
 * - سایر خطاها: نمایش پیام server در toast
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginRequest = req.url.endsWith('/api/admin/login');

      if (error.status === 401 && req.url.includes('/api/admin') && !isLoginRequest) {
        auth.logout();
        router.navigateByUrl('/admin/login');
        toastr.warning('جلسه‌ی شما به پایان رسیده است. لطفاً دوباره وارد شوید.');
      } else if (error.status !== 404) {
        const message: string =
          (error.error && typeof error.error.message === 'string' && error.error.message) ||
          'خطایی رخ داده است. لطفاً دوباره تلاش کنید.';
        toastr.error(message);
      }

      return throwError(() => error);
    })
  );
};
