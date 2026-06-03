import { Component, OnInit, inject, input } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { AppCommonService } from '../../shared/services/app-common.service';
import { DateUtils } from '../../shared/utilities/app.utilities';
import { TemplateList } from '../role.models';

@Component({
  selector: 'app-monthly',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, MonthNamePipe],
  templateUrl: './monthly.component.html',
  styleUrl: './monthly.component.scss'
})
export class MonthlyComponent implements OnInit {

  // Angular 19 signal-based input — replaces @Input() decorator
  monthlyTemplateList = input<TemplateList[]>([]);

  private appCommonService = inject(AppCommonService);

  public templateName: string = '';

  ngOnInit(): void {
    this.templateName = this.monthlyTemplateList()[0]?.template ?? '';
  }

  checkStatus(status: string): string {
    return this.appCommonService.getColorForStatus(status);
  }

  dateConvert(date: string): string {
    return DateUtils.getUTCFormatTime(date);
  }
}
