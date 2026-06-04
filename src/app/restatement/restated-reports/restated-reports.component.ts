import { Component } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';

@Component({
  selector: 'app-restated-reports',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './restated-reports.component.html',
  styleUrl: './restated-reports.component.scss'
})
export class RestatedReportsComponent {

}
