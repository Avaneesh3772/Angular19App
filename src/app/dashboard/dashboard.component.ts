import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ANGULAR_MATERIAL_MODULES } from '../shared/angular-material';
import { DashboardConstants } from './dashboard.constants';
import { PostComment, UserList } from './dashboard.models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ...ANGULAR_MATERIAL_MODULES,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private dashboardService = inject(DashboardService);

  public dataSource: UserList[] = [];
  public displayedColumns: string[] = DashboardConstants.displayedColumns;
  public errorMessage: string = '';
  public userDataLoaded = false;
  public dropDownData$!: Observable<PostComment[]>;
  public userTopic: string = '';

  ngOnInit(): void {
    this.showUserTable();
    this.dropDownData$ = this.dashboardService.getDropdownList(
      'https://jsonplaceholder.typicode.com/posts/1/comments'
    );
  }

  updateTopic(value: string): void {
    console.log('topic select box value -', value);
  }

  showUserTable(): void {
    this.dashboardService.getUsersList(DashboardConstants.userApiURL).subscribe({
      next: (response: UserList[]) => {
        this.dataSource = response;
        this.userDataLoaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.userDataLoaded = false;
        console.log('Dashboard error =>', error);
      }
    });
  }

  showDialogBox(item: UserList): void {
    // Will be implemented when dialog-userinfo component is added
    console.log('showDialogBox called for =>', item);
  }
}
