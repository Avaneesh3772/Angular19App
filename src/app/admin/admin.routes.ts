import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CloseQuarterComponent } from './close-quarter/close-quarter.component';
import { LeCalculationComponent } from './le-calculation/le-calculation.component';
import { RoundingModelCalculationComponent } from './rounding-model-calculation/rounding-model-calculation.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'close-quarter',
        pathMatch: 'full'
      },
      {
        path: 'close-quarter',
        component: CloseQuarterComponent,
        data: { title: 'Close Quarter' }
      },
      {
        path: 'le-calculation',
        component: LeCalculationComponent,
        data: { title: 'LE Calculation' }
      },
      {
        path: 'rounding-model-calculation',
        component: RoundingModelCalculationComponent,
        data: { title: 'Rounding Model Calculation' }
      }
    ]
  }
];