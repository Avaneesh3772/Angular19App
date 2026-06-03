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
    return new Promise<string>((resolve) => {
      this.authTokenService.setTokenToSessionStorage('token', AuthToken);

      this.userAuthorizationService.getAppConfigData(AppConstants.appConfigDataURL)
        .subscribe({
          next: (response: UserPersonalInfo) => {
            if (response) {
              this.userInformation = response;
              console.log('App configuration loaded successfully:', response);
            }
            resolve('App config loaded successfully.');
          },
          error: (error) => {
            console.error('Failed to load app configuration, proceeding with defaults:', error);
            resolve('App config failed — proceeding with defaults.');
          }
        });
    });
  }

  getAppConfigartionData(): UserPersonalInfo | null {
    return this.userInformation;
  }
}
