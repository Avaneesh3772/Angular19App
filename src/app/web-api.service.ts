import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WebApiService {

  protected http = inject(HttpClient);

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  baseHttpGetRequest<T>(apiURL: string, httpParams?: HttpParams): Observable<T> {
    return this.http.get<T>(apiURL, { params: httpParams, headers: this.jsonHeaders })
      .pipe(catchError(this.errorHandler));
  }

  baseHttpPostRequest<T>(apiURL: string, body: unknown, httpParams?: HttpParams): Observable<T> {
    return this.http.post<T>(apiURL, JSON.stringify(body), { params: httpParams, headers: this.jsonHeaders })
      .pipe(catchError(this.errorHandler));
  }

  baseHttpPutRequest<T>(apiURL: string, body: unknown, httpParams?: HttpParams): Observable<T> {
    return this.http.put<T>(apiURL, JSON.stringify(body), { params: httpParams, headers: this.jsonHeaders })
      .pipe(catchError(this.errorHandler));
  }

  baseHttpDeleteRequest<T>(apiURL: string, httpParams?: HttpParams): Observable<T> {
    return this.http.delete<T>(apiURL, { params: httpParams, headers: this.jsonHeaders })
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    console.log('Inside WebApiService Error =>', error);
    return throwError(() => error);
  }
}
