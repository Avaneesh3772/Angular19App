import { Component } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';

@Component({
  selector: 'app-mutate-signal',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './mutate-signal.component.html',
  styleUrl: './mutate-signal.component.scss'
})
export class MutateSignalComponent {}
