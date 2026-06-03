import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ANGULAR_MATERIAL_MODULES } from '../../angular-material';

@Component({
  selector: 'app-dialog-not-authorized',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './dialog-not-authorized.component.html',
  styleUrl: './dialog-not-authorized.component.scss'
})
export class DialogNotAuthorizedComponent {

  private dialogRef = inject(MatDialogRef<DialogNotAuthorizedComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
