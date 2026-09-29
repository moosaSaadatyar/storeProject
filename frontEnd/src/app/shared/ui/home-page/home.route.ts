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
];
