import { Routes } from '@angular/router';

export const ProductRoutes: Routes = [

  {
    path: '',
    loadComponent: () => import('./product').then((m) => m.Product),
  },
  {
    path: ':id/detailes',
    loadChildren: () => null
      // import('../../../feature/product').then((m) => m.HomeRoutes),
  },
  {
    path: ':id/edit',
    loadChildren: () => null
      // import('../../../feature/product').then((m) => m.HomeRoutes),
  }
];
