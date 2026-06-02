import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'templates',
    loadChildren: () => import('./templates/templates.routes').then(m => m.TEMPLATES_ROUTES)
  },
  {
    path: 'role',
    loadChildren: () => import('./role/role.routes').then(m => m.ROLE_ROUTES)
  },
  {
    path: 'restatement',
    loadChildren: () => import('./restatement/restatement.routes').then(m => m.RESTATEMENT_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];