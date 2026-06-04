import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ANGULAR_MATERIAL_MODULES } from '../shared/angular-material';
import { DialogCreateResourceComponent } from './dialog-create-resource/dialog-create-resource.component';
import { DialogPostCommentsComponent } from './dialog-post-comments/dialog-post-comments.component';
import { TemplateConstants } from './template.constants';
import { CreatePostModel, PostList } from './template.models';
import { TemplatesService } from './templates.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {

  private dialog = inject(MatDialog);
  private templatesService = inject(TemplatesService);

  public displayedColumns: string[] = TemplateConstants.displayedColumns;
  public dataSource: PostList[] = [];
  public userDataLoaded = false;
  public errorMessage = '';

  ngOnInit(): void {
    this.getTemplateData();
  }

  getTemplateData(): void {
    this.templatesService.getAllTemplateData(TemplateConstants.getTemplateURL).subscribe({
      next: (response: PostList[]) => {
        this.dataSource = response;
        this.userDataLoaded = true;
        console.log('GET Template Response =>', response);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        console.log('Template load error =>', error);
      }
    });
  }

  openCreateNewResourceDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateResourceComponent, {
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: CreatePostModel | null) => {
      console.log('Dialog result =>', result);
      if (result && result.title && result.body && result.userId > 0) {
        this.createNewResource(result);
      }
    });
  }

  createNewResource(postBody: CreatePostModel): void {
    const httpParams = new HttpParams()
      .set('name', 'Avaneesh')
      .set('city', 'Toronto');

    this.templatesService.postNewTemplateData(TemplateConstants.postTemplateURL, postBody, httpParams)
      .subscribe({
        next: (response: PostList) => {
          console.log('POST Response =>', response);
          this.getTemplateData();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message;
          console.log('POST error =>', error);
        }
      });
  }

  updateResource(element: PostList): void {
    const updateBody: PostList = {
      id: element.id,
      userId: element.userId,
      title: 'Avaneesh Mishra',
      body: 'Update Data by PUT Method Testing',
    };

    this.templatesService.updateNewTemplateData(TemplateConstants.updateTemplateURL(element.id), updateBody)
      .subscribe({
        next: (response: PostList) => {
          console.log('PUT Response =>', response);
          this.getTemplateData();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message;
          console.log('PUT error =>', error);
        }
      });
  }

  deleteResource(element: PostList): void {
    this.templatesService.deleteTemplateData(TemplateConstants.deleteTemplateURL(element.id))
      .subscribe({
        next: (response) => {
          console.log('DELETE Response =>', response);
          this.getTemplateData();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message;
          console.log('DELETE error =>', error);
        }
      });
  }

  openCommentsDialog(rowData: PostList): void {
    const dialogRef = this.dialog.open(DialogPostCommentsComponent, {
      height: '600px',
      width: '900px',
      maxWidth: '900px',
      data: { rowData }
    });

    dialogRef.afterClosed().subscribe((result: unknown) => {
      console.log('Comments dialog closed =>', result);
    });
  }
}
