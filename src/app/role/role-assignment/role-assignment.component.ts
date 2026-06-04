import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { RoleConstants } from '../role.constants';
import { Users, UsersRole } from '../role.models';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-role-assignment',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './role-assignment.component.html',
  styleUrl: './role-assignment.component.scss'
})
export class RoleAssignmentComponent implements OnInit {

  private roleService = inject(RoleService);

  // Typed FormControl — value is always string, never null
  public searchUser = new FormControl<string>('', { nonNullable: true });

  public responseData: Users[] = [];
  public filteredItems: Users[] = [];
  public dataSource: UsersRole[] = [];
  public displayedColumns: string[] = RoleConstants.displayedColumns;
  public errorMessage: string = '';
  public userFullName: string = '';
  public userDataLoaded = false;
  public isUserDataAvailable = false;
  public showResultBox = false;
  public noRecordsFound = false;

  ngOnInit(): void {
    this.getUserData();
    this.subscribeToSearchBox();
  }

  getUserData(): void {
    this.roleService.getUsersSearchList(RoleConstants.roleAssignmentDataURL).subscribe({
      next: (response: Users[]) => {
        this.responseData = response;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log('Role Assignment load error =>', error);
      }
    });
  }

  subscribeToSearchBox(): void {
    this.searchUser.valueChanges.subscribe((value: string) => {
      this.filteredItems = this.responseData.filter(item => {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });

      const hasInput = value.length > 0;
      const hasResults = this.filteredItems.length > 0;

      this.noRecordsFound = hasInput && !hasResults;
      this.showResultBox = hasInput && hasResults;
    });
  }

  selectedValue(item: Users): void {
    this.isUserDataAvailable = true;
    this.showResultBox = false;
    this.userFullName = `${item.firstName} ${item.lastName}`;
    this.searchUser.setValue('', { emitEvent: false });

    this.roleService.getUserFullDetails(RoleConstants.roleAssignmentUserDataURL).subscribe({
      next: (response: UsersRole[]) => {
        this.dataSource = response.filter(
          element => element.employeeIdentifier === item.employeeIdentifier
        );
        this.userDataLoaded = true;
        console.log('User role data =>', this.dataSource);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log('Role Assignment details error =>', error);
      }
    });
  }
}
