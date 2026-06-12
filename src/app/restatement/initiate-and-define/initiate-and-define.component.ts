import { Component } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';

@Component({
  selector: 'app-initiate-and-define',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './initiate-and-define.component.html',
  styleUrl: './initiate-and-define.component.scss',
})
export class InitiateAndDefineComponent {}
