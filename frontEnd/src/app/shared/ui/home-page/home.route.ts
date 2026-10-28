import { Routes } from '@angular/router';

export const HomeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home-page').then((m) => m.HomePage),
  },
  {
    path: 'request',
    loadComponent: () =>
      import('../../../feature/user-request-form/user-request-form.component').then((m) => m.UserRequestFormComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('../../../layouts/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../../layouts/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
