import { Routes } from '@angular/router';
import { BasicSignalsComponent } from './basic-signals/basic-signals.component';
import { ComputedSignalsComponent } from './computed-signals/computed-signals.component';
import { EffectsSignalsComponent } from './effects-signals/effects-signals.component';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { MutateSignalComponent } from './mutate-signal/mutate-signal.component';
import { ResourceSignalComponent } from './resource-signal/resource-signal.component';
import { SignalsLearningComponent } from './signals-learning.component';
import { ToObservableComponent } from './to-observable/to-observable.component';
import { ToSignalComponent } from './to-signal/to-signal.component';

export const SIGNALS_LEARNING_ROUTES: Routes = [
  {
    path: '',
    component: SignalsLearningComponent,
    children: [
      { path: '',                redirectTo: 'basic-signals', pathMatch: 'full' },
      { path: 'basic-signals',   component: BasicSignalsComponent   },
      { path: 'computed-signals',component: ComputedSignalsComponent },
      { path: 'effects-signals', component: EffectsSignalsComponent  },
      { path: 'to-signal',       component: ToSignalComponent        },
      { path: 'to-observable',   component: ToObservableComponent    },
      { path: 'linked-signal',   component: LinkedSignalComponent    },
      { path: 'resource-signal', component: ResourceSignalComponent  },
      { path: 'mutate-signal',   component: MutateSignalComponent    },
    ]
  }
];
