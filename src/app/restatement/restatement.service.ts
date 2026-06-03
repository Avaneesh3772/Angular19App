import { Injectable } from '@angular/core';
import { WebApiService } from '../web-api.service';
import { HttpParams } from '@angular/common/http';
import { CommentsList } from './restatement.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestatementService extends WebApiService { 

  getCommentsList(apiURL:string, httpParams?: HttpParams): Observable<CommentsList[]> {
    return this.baseHttpGetRequest<CommentsList[]>(apiURL, httpParams)
  }
}
