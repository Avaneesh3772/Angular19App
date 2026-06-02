import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from '../../web-api.service';
import { UserPersonalInfo } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class UserAuthorizationService extends WebApiService {

  getAppConfigData(apiURL: string, httpParams?: HttpParams): Observable<UserPersonalInfo> {
    return this.baseHttpGetRequest<UserPersonalInfo>(apiURL, httpParams);
  }
}
