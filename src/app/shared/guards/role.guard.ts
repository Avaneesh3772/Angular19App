import { Injectable, inject } from '@angular/core';
import { CanMatch } from '@angular/router';
import { DialogNotAuthorizedComponent } from '../components/dialog-not-authorized/dialog-not-authorized.component';
import { AppCommonService } from '../services/app-common.service';
import { AppInitializerDataService } from '../services/app-initializer-data.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanMatch {

  private appInitializerDataService = inject(AppInitializerDataService);
  private appCommonService = inject(AppCommonService);

  canMatch(): boolean {
    const appConfigData = this.appInitializerDataService.getAppConfigurationData();
    const hasRole = appConfigData?.roles.includes('rolemanagement') ?? false;

    if (hasRole) {
      return true;
    }

    this.appCommonService.openNotAuthorizedDialogBox(DialogNotAuthorizedComponent);
    return false;
  }
}
