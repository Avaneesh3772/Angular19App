import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rxjs-learning',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class RxjsLearningComponent {}
