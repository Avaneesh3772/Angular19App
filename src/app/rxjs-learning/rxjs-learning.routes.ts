import { Routes } from '@angular/router';
import { CombinationComponent } from './combination/combination.component';
import { CreationComponent } from './creation/creation.component';
import { ErrorHandlingComponent } from './error-handling/error-handling.component';
import { FilteringComponent } from './filtering/filtering.component';
import { RxjsLearningComponent } from './rxjs-learning.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TransformationComponent } from './transformation/transformation.component';

export const RXJS_LEARNING_ROUTES: Routes = [
  {
    path: '',
    component: RxjsLearningComponent,
    children: [
      { path: '', redirectTo: 'creation', pathMatch: 'full' },
      { path: 'creation',        component: CreationComponent },
      { path: 'filtering',       component: FilteringComponent },
      { path: 'transformation',  component: TransformationComponent },
      { path: 'combination',     component: CombinationComponent },
      { path: 'error-handling',  component: ErrorHandlingComponent },
      { path: 'subjects',        component: SubjectsComponent },
    ],
  },
];
