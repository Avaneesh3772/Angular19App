import { Routes } from '@angular/router';
import { InitiateAndDefineComponent } from './initiate-and-define/initiate-and-define.component';
import { RestatedReportsComponent } from './restated-reports/restated-reports.component';
import { TrackAndActionComponent } from './track-and-action/track-and-action.component';
import { TrackComponent } from './track/track.component';

export const RESTATEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'initiate-and-define',
    pathMatch: 'full'
  },
  {
    path: 'initiate-and-define',
    component: InitiateAndDefineComponent,
    data: { title: 'Initiate and Define' }
  },
  {
    path: 'track-and-action',
    component: TrackAndActionComponent,
    data: { title: 'Track and Action' }
  },
  {
    path: 'track/:id',
    component: TrackComponent,
    data: { title: 'Track' }
  },
  {
    path: 'restated-reports',
    component: RestatedReportsComponent,
    data: { title: 'Restated Reports' }
  }
];
