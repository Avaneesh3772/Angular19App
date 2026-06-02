import { Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';

export const TEMPLATES_ROUTES: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    data: { title: 'Templates' }
  }
];
