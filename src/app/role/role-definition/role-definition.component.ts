import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { frenquencyType, RoleConstants } from '../role.constants';
import { TemplateList } from '../role.models';
import { RoleService } from '../role.service';
import { Child2ParentData, QuarterlyComponent } from '../quarterly/quarterly.component';
import { MonthlyComponent } from '../monthly/monthly.component';

@Component({
  selector: 'app-role-definition',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, MonthlyComponent, QuarterlyComponent],
  templateUrl: './role-definition.component.html',
  styleUrl: './role-definition.component.scss'
})
export class RoleDefinitionComponent implements OnInit {

  private roleService = inject(RoleService);

  public monthlyTemplateList: TemplateList[] = [];
  public quartelyTemplateList: TemplateList[] = [];
  public monthlyTemplateListLength: number = 0;
  public quartelyTemplateListLength: number = 0;
  public errorMessage: string = '';
  public displayChild2ParentData: Child2ParentData | null = null;

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.roleService.getUsersList(RoleConstants.roleMockDataURL).subscribe({
      next: (response: TemplateList[]) => {
        console.log('roleMockData =>', response);

        this.monthlyTemplateList = response.filter(
          item => item.frequency === frenquencyType.monthly
        );
        this.monthlyTemplateListLength = this.monthlyTemplateList.length;

        this.quartelyTemplateList = response.filter(
          item => item.frequency === frenquencyType.quartely
        );
        this.quartelyTemplateListLength = this.quartelyTemplateList.length;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log('Role Definition error =>', error);
      }
    });
  }

  printChild2ParentData(event: Child2ParentData): void {
    console.log('Child to Parent event =>', event);
    this.displayChild2ParentData = event;
  }
}
