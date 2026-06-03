import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from '../web-api.service';
import { TemplateList } from './role.models';

@Injectable({ providedIn: 'root' })
export class RoleService extends WebApiService {

  getUsersList(apiURL: string, httpParams?: HttpParams): Observable<TemplateList[]> {
    return this.baseHttpGetRequest<TemplateList[]>(apiURL, httpParams);
  }
}
