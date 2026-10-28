import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

/**
 * اینترسپتر احراز هویت — اگر توکن مدیر موجود باشد هدر Authorization را اضافه می‌کند
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request);
};
