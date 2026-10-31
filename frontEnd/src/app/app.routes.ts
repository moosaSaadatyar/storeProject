import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './feature/admin/admin-layout/admin-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BlockAuthGuard } from './core/guards/block-auth.guard';

export const routes: Routes = [
  /* ============================ پنل مدیریت ============================
     نکته: باید قبل از مسیر عمومی '' قرار بگیرد؛ در غیر این صورت
     catch-all (**) داخل مسیر عمومی، همه‌ی URLها را می‌بلعد.
  ================================================================== */

  // صفحه‌ی ورود — اگر مدیر وارد شده باشد به داشبورد می‌رود
  {
    path: 'admin/login',
    canActivate: [BlockAuthGuard],
    data: {
      seo: {
        title: 'ورود به پنل مدیریت | عزیزی کابینت‌سازی',
        description: 'ورود مدیر به پنل مدیریت سایت عزیزی کابینت‌سازی',
        noindex: true,
      },
    },
    loadComponent: () =>
      import('./feature/admin/login/admin-login.page').then((m) => m.AdminLoginPage),
  },

  // بقیه‌ی پنل — با احراز هویت
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {
      seo: {
        title: 'پنل مدیریت | عزیزی کابینت‌سازی',
        description: 'پنل مدیریت سایت عزیزی کابینت‌سازی',
        noindex: true,
      },
    },
    children: [
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./feature/admin/dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./feature/admin/projects/admin-projects.page').then((m) => m.AdminProjectsPage),
          },
          {
            path: 'projects/new',
            loadComponent: () =>
              import('./feature/admin/projects/admin-project-form.page').then((m) => m.AdminProjectFormPage),
          },
          {
            path: 'projects/:id/edit',
            loadComponent: () =>
              import('./feature/admin/projects/admin-project-form.page').then((m) => m.AdminProjectFormPage),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./feature/admin/categories/admin-categories.page').then((m) => m.AdminCategoriesPage),
          },
          {
            path: 'services',
            loadComponent: () =>
              import('./feature/admin/services/admin-services.page').then((m) => m.AdminServicesPage),
          },
          {
            path: 'consultations',
            loadComponent: () =>
              import('./feature/admin/consultations/admin-consultations.page').then((m) => m.AdminConsultationsPage),
          },
          {
            path: 'contact',
            loadComponent: () =>
              import('./feature/admin/contact/admin-contact.page').then((m) => m.AdminContactPage),
          },
          {
            path: 'testimonials',
            loadComponent: () =>
              import('./feature/admin/testimonials/admin-testimonials.page').then((m) => m.AdminTestimonialsPage),
          },
          {
            path: 'faqs',
            loadComponent: () =>
              import('./feature/admin/faqs/admin-faqs.page').then((m) => m.AdminFaqsPage),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./feature/admin/settings/admin-settings.page').then((m) => m.AdminSettingsPage),
          },
          { path: '**', redirectTo: 'dashboard' },
        ],
      },
    ],
  },

  /* ============================ صفحات عمومی ============================ */
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // '', 'home', 'request', 'terms'
      {
        path: '',
        loadChildren: () =>
          import('./shared/ui/home-page/home.route').then((m) => m.HomeRoutes),
      },
      {
        path: 'portfolio',
        data: {
          seo: {
            title: 'نمونه‌کارها و پروژه‌های اجراشده | عزیزی کابینت‌سازی',
            description: 'گالری نمونه‌کارهای اجراشده — کابینت آشپزخانه مدرن، نئوکلاسیک و کلاسیک، کمد دیواری و کلوزت با جزئیات کامل متریال و مشخصات هر پروژه.',
            image: '/images/bg-Home.jpg',
          },
        },
        loadComponent: () =>
          import('./feature/portfolio/portfolio.page').then((m) => m.PortfolioPage),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./feature/project-detail/project-detail.page').then((m) => m.ProjectDetailPage),
      },
      {
        path: 'services',
        data: {
          seo: {
            title: 'خدمات طراحی و ساخت کابینت | عزیزی کابینت‌سازی',
            description: 'خدمات طراحی اختصاصی، ساخت، نصب و نوسازی کابینت — رندر سه‌بعدی رایگان، متریال درجه‌یک، ضمانت ۵ ساله ساخت و خدمات پس از فروش.',
            image: '/images/bg-Home.jpg',
          },
        },
        loadComponent: () =>
          import('./feature/services/services.page').then((m) => m.ServicesPage),
      },
      {
        path: 'about',
        data: {
          seo: {
            title: 'درباره ما | عزیزی کابینت‌سازی',
            description: 'آشنایی با عزیزی کابینت‌سازی؛ بیش از ۱۲ سال تجربه در طراحی و اجرای کابینت با تیم مهندسی، استادکاران باتجربه و متریال درجه‌یک.',
            image: '/images/bg-Home.jpg',
          },
        },
        loadComponent: () =>
          import('./feature/about/about.page').then((m) => m.AboutPage),
      },
      {
        path: 'contact',
        data: {
          seo: {
            title: 'تماس با ما | عزیزی کابینت‌سازی',
            description: 'تماس با عزیزی کابینت‌سازی — شماره تلفن، آدرس، ساعات کاری و ارسال پیام. مشاوره و بازدید برای اندازه‌گیری رایگان است.',
            image: '/images/bg-Home.jpg',
          },
        },
        loadComponent: () =>
          import('./feature/contact/contact.page').then((m) => m.ContactPage),
      },
      {
        path: '**',
        data: {
          seo: {
            title: 'صفحه یافت نشد | عزیزی کابینت‌سازی',
            noindex: true,
          },
        },
        loadComponent: () =>
          import('./layouts/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },

  // سایر مسیرهای ناموجود (خارج از چیدمان عمومی)
  {
    path: '**',
    data: {
      seo: {
        title: 'صفحه یافت نشد | عزیزی کابینت‌سازی',
        noindex: true,
      },
    },
    loadComponent: () =>
      import('./layouts/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
