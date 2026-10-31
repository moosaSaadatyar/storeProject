import { Routes } from '@angular/router';

export const HomeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    data: {
      seo: {
        title: 'عزیزی کابینت‌سازی | طراحی و اجرای کابینت',
        description: 'طراحی و اجرای کابینت آشپزخانه، کمد دیواری، کلوزت و جزیره آشپزخانه با متریال درجه‌یک، طراحی اختصاصی، رندر سه‌بعدی رایگان و مشاوره رایگان.',
        image: '/images/bg-Home.jpg',
      },
    },
    loadComponent: () => import('./home-page').then((m) => m.HomePage),
  },
  {
    path: 'request',
    data: {
      seo: {
        title: 'درخواست مشاوره رایگان کابینت | عزیزی کابینت‌سازی',
        description: 'ثبت درخواست مشاوره رایگان کابینت — هماهنگی سریع بازدید، اندازه‌گیری و ارائه طرح اختصاصی متناسب با فضای شما.',
      },
    },
    loadComponent: () =>
      import('../../../feature/user-request-form/user-request-form.component').then((m) => m.UserRequestFormComponent),
  },
  {
    path: 'terms',
    data: {
      seo: {
        title: 'قوانین و مقررات | عزیزی کابینت‌سازی',
        description: 'قوانین و مقررات استفاده از سایت عزیزی کابینت‌سازی — حقوق مالکیت، شرایط استفاده و محرمانگی اطلاعات.',
      },
    },
    loadComponent: () =>
      import('../../../layouts/terms/terms.component').then((m) => m.TermsComponent),
  },
];
