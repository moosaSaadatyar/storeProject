import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () =>
      import('./shared/ui/home-page/home.route').then((m) => m.HomeRoutes),
  },
  // مسیر 'admin' در مرحله‌ی پیاده‌سازی پنل مدیریت اضافه می‌شود
];
