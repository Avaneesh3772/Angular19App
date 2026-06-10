import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { WebApiService } from '../web-api.service';
import { ApiComment, ApiTodo, ApiUser } from './rxjs-learning.models';
import { RxjsConstants } from './rxjs-learning.constants';

@Injectable({ providedIn: 'root' })
export class RxjsLearningService extends WebApiService {

  getUsers(httpParams?: HttpParams): Observable<ApiUser[]> {
    return this.baseHttpGetRequest<ApiUser[]>(RxjsConstants.usersApiURL, httpParams);
  }

  getTodos(httpParams?: HttpParams): Observable<ApiTodo[]> {
    return this.baseHttpGetRequest<ApiTodo[]>(RxjsConstants.todosApiURL, httpParams);
  }

  getComments(httpParams?: HttpParams): Observable<ApiComment[]> {
    return this.baseHttpGetRequest<ApiComment[]>(RxjsConstants.commentsApiURL, httpParams);
  }

  // Used for the throwError / catchError demo — always fails
  getFailingRequest(): Observable<never> {
    return throwError(() => new Error('Simulated server error — HTTP 500'));
  }
}
