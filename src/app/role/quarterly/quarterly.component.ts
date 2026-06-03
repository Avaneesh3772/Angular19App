import { Component, OnInit, inject, input, output } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { AppCommonService } from '../../shared/services/app-common.service';
import { DateUtils } from '../../shared/utilities/app.utilities';
import { TemplateList } from '../role.models';

export interface Child2ParentData {
  name: string;
  city: string;
  Gender: string;
}

@Component({
  selector: 'app-quarterly',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, MonthNamePipe],
  templateUrl: './quarterly.component.html',
  styleUrl: './quarterly.component.scss'
})
export class QuarterlyComponent implements OnInit {

  // Angular 19 signal-based input/output — replaces @Input()/@Output() + EventEmitter
  quartelyTemplateList = input<TemplateList[]>([]);
  child2ParentDataTransfer = output<Child2ParentData>();

  private appCommonService = inject(AppCommonService);

  public templateName: string = '';

  ngOnInit(): void {
    this.templateName = this.quartelyTemplateList()[0]?.template ?? '';
  }

  checkStatus(status: string): string {
    return this.appCommonService.getColorForStatus(status);
  }

  dateConvert(date: string): string {
    return DateUtils.getUTCFormatTime(date);
  }

  child2ParentMethod(): void {
    const emitDataObject: Child2ParentData = {
      name: 'Andrew',
      city: 'London',
      Gender: 'Male'
    };
    this.child2ParentDataTransfer.emit(emitDataObject);
  }
}
