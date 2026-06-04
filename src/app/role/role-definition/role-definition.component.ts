import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { frequencyType, RoleConstants } from '../role.constants';
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
  public quarterlyTemplateList: TemplateList[] = [];
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
          item => item.frequency === frequencyType.monthly
        );

        this.quarterlyTemplateList = response.filter(
          item => item.frequency === frequencyType.quarterly
        );
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
