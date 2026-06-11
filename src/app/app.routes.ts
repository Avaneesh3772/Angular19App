import { Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { DashboardGuard } from './shared/guards/dashboard.guard';
import { RestatementGuard } from './shared/guards/restatement.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { TemplateGuard } from './shared/guards/template.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canMatch: [DashboardGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'admin',
    canMatch: [AdminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'templates',
    canMatch: [TemplateGuard],
    loadChildren: () => import('./templates/templates.routes').then(m => m.TEMPLATES_ROUTES)
  },
  {
    path: 'role',
    canMatch: [RoleGuard],
    loadChildren: () => import('./role/role.routes').then(m => m.ROLE_ROUTES)
  },
  {
    path: 'restatement',
    canMatch: [RestatementGuard],
    loadChildren: () => import('./restatement/restatement.routes').then(m => m.RESTATEMENT_ROUTES)
  },
  {
    path: 'rxjs-learning',
    loadChildren: () => import('./rxjs-learning/rxjs-learning.routes').then(m => m.RXJS_LEARNING_ROUTES)
  },
  {
    path: 'signals-learning',
    loadChildren: () => import('./signals-learning/signals-learning.routes').then(m => m.SIGNALS_LEARNING_ROUTES)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];