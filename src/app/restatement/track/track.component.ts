import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { RestatementConstants } from '../restatement.constants';
import { CommentsList } from '../restatement.models';
import { RestatementService } from '../restatement.service';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss'
})
export class TrackComponent implements OnInit {

  private restatementService = inject(RestatementService);
  private activatedRoute = inject(ActivatedRoute);

  public getCommentID!: number;
  public getSelectedComment!: CommentsList;
  public errorMessage: string = '';

  ngOnInit(): void {
    this.getCommentID = +this.activatedRoute.snapshot.params['id'];

    this.restatementService.getCommentsList(RestatementConstants.commentsApiURL).subscribe({
      next: (response: CommentsList[]) => {
        const filteredData = response.filter(item => item.id === this.getCommentID);
        this.getSelectedComment = filteredData[0];
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log('Track error =>', error);
      }
    });
  }
}
