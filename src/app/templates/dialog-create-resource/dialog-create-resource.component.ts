import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { CreatePostModel } from '../template.models';

@Component({
  selector: 'app-dialog-create-resource',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES, FormsModule],
  templateUrl: './dialog-create-resource.component.html',
  styleUrl: './dialog-create-resource.component.scss'
})
export class DialogCreateResourceComponent {

  private dialogRef = inject(MatDialogRef<DialogCreateResourceComponent>);

  public createPost: CreatePostModel = {
    title: '',
    body: '',
    userId: 0
  };

  formSubmit(userForm: NgForm): void {
    console.log('Create resource form =>', userForm.value);
    this.dialogRef.close(this.createPost);
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
