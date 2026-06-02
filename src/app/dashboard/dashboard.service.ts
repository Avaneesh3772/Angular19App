import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from '../web-api.service';
import { UserList } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService extends WebApiService {

  getUsersList(apiURL: string, httpParams?: HttpParams): Observable<UserList[]> {
    return this.baseHttpGetRequest<UserList[]>(apiURL, httpParams);
  }

  getDropdownList<T>(apiURL: string, httpParams?: HttpParams): Observable<T> {
    return this.baseHttpGetRequest<T>(apiURL, httpParams);
  }
}
