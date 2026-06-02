import { Injectable, inject } from '@angular/core';
import { AppConstants, AuthToken } from '../constants/app.constants';
import { UserPersonalInfo } from '../models/app.models';
import { AuthTokenService } from './auth-token.service';
import { UserAuthorizationService } from './user-authorization.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerDataService {

  private userAuthorizationService = inject(UserAuthorizationService);
  private authTokenService = inject(AuthTokenService);

  private userInformation: UserPersonalInfo | null = null;

  AppConfigartionData(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.authTokenService.setTokenToSessionStorage('token', AuthToken);

      this.userAuthorizationService.getAppConfigData(AppConstants.appConfigDataURL)
        .subscribe({
          next: (response: UserPersonalInfo) => {
            if (response) {
              this.userInformation = response;
              resolve('Promise is resolved successfully.');
            } else {
              reject('Promise is rejected');
            }
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  getAppConfigartionData(): UserPersonalInfo | null {
    return this.userInformation;
  }
}
