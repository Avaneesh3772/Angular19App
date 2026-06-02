import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { UserList } from '../dashboard.models';

@Component({
  selector: 'app-dialog-userinfo',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './dialog-userinfo.component.html',
  styleUrl: './dialog-userinfo.component.scss'
})
export class DialogUserinfoComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<DialogUserinfoComponent>);
  public data = inject<{ userInfo: UserList }>(MAT_DIALOG_DATA);

  public userInfo: UserList = this.data.userInfo;

  close(): void {
    this.dialogRef.close();
  }

   ngOnInit(): void {
  }
}
