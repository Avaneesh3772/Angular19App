import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { TemplateConstants } from '../template.constants';
import { CommentList, PostList } from '../template.models';
import { TemplatesService } from '../templates.service';

@Component({
  selector: 'app-dialog-post-comments',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './dialog-post-comments.component.html',
  styleUrl: './dialog-post-comments.component.scss'
})
export class DialogPostCommentsComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<DialogPostCommentsComponent>);
  private templatesService = inject(TemplatesService);
  public data = inject<{ rowData: PostList }>(MAT_DIALOG_DATA);

  public rowData: PostList = this.data.rowData;
  public dataSource: CommentList[] = [];
  public displayedColumns: string[] = TemplateConstants.displayedColumnsComments;
  public userDataLoaded = false;
  public errorMessage = '';

  ngOnInit(): void {
    this.getCommentsData();
  }

  getCommentsData(): void {
    this.templatesService.getAllCommentsData(TemplateConstants.commentsApiURL(this.rowData.id))
      .subscribe({
        next: (response: CommentList[]) => {
          this.dataSource = response;
          this.userDataLoaded = true;
          console.log('Comments response =>', response);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message;
          console.log('Comments error =>', error);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
