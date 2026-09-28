import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'businesses' },
  {
    path: 'login',
    loadComponent: () => import('./ui/login/login').then((m) => m.Login),
  },
  {
    path: 'businesses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./ui/business-list/business-list').then((m) => m.BusinessList),
  },
  {
    path: 'businesses/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./ui/business-detail/business-detail').then((m) => m.BusinessDetail),
  },
  { path: '**', redirectTo: 'businesses' },
];
