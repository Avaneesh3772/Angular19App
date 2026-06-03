import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { AppCommonService } from '../../shared/services/app-common.service';
import { DateUtils } from '../../shared/utilities/app.utilities';
import { AdminConstants } from '../admin.constants';
import { TemplateDetails } from '../admin.models';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-rounding-model-calculation',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, MonthNamePipe],
  templateUrl: './rounding-model-calculation.component.html',
  styleUrl: './rounding-model-calculation.component.scss'
})
export class RoundingModelCalculationComponent implements OnInit {

  private adminService = inject(AdminService);
  private appCommonService = inject(AppCommonService);

  public dataSource: TemplateDetails[] = [];
  public displayedColumns: string[] = AdminConstants.displayedColumns;
  public errorMessage: string = '';
  public userDataLoaded = false;

  ngOnInit(): void {
    this.showUserTable();
  }

  showUserTable(): void {
    this.adminService.getUsersList(AdminConstants.adminMockDataURL).subscribe({
      next: (response: TemplateDetails[]) => {
        this.dataSource = response;
        this.userDataLoaded = true;
        console.log('adminMockData', response);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.userDataLoaded = false;
        console.log('Rounding Model error =>', error);
      }
    });
  }

  checkStatus(status: string): string {
    return this.appCommonService.getColorForStatus(status);
  }

  dateConvert(date: string): string {
    return DateUtils.getUTCFormatTime(date);
  }
}
