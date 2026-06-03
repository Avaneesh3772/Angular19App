import { Component, inject, OnInit } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { CommentsList } from '../restatement.models';
import { RestatementConstants } from '../restatement.constants';
import { RestatementService } from '../restatement.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track-and-action',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './track-and-action.component.html',
  styleUrl: './track-and-action.component.scss'
})
export class TrackAndActionComponent implements OnInit{
  private restatementService = inject(RestatementService);
  private router = inject(Router);

  public dataSource: CommentsList[] = [];
  public displayedColumns: string[] = RestatementConstants.displayedColumns;
  public errorMessage: string = '';
  public userDataLoaded = false;

  ngOnInit(): void {
    this.showCommentsTable();
  }

  showCommentsTable(): void {
    this.restatementService.getCommentsList(RestatementConstants.commentsApiURL).subscribe({
      next: (response: CommentsList[]) => {
        const sortCommentsArray = response.filter(item => item.id < 21);
        this.dataSource = sortCommentsArray;
        this.userDataLoaded = true;
      },
      error: (error:HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.userDataLoaded = false;
        console.log('Track and action error =>', error);
      }
    });
  }

  navigateToTrack(element: CommentsList) {
    this.router.navigate(['restatement/track', element.id ]);
  }

}
