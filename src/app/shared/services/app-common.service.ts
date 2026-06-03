import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { statusType } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AppCommonService {

  private dialog = inject(MatDialog);

  getColorForStatus(status: string): string {
    if (status === statusType.success) return 'green';
    if (status === statusType.failed) return 'red';
    return 'orange';
  }

  openNotAuthorizedDialogBox(dialogComponent: ComponentType<unknown>): void {
    const dialogRef = this.dialog.open(dialogComponent, {
      height: '300px',
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Not-authorized dialog closed, result:', result);
    });
  }
}
