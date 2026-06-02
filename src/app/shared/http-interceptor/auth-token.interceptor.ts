import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, retry, throwError } from 'rxjs';
import { AuthTokenService } from '../services/auth-token.service';

export function authTokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authTokenService = inject(AuthTokenService);

  const requestWithAuthToken = request.clone({
    setHeaders: {
      Authorization: `Bearer ${authTokenService.getTokenFromSessionStorage('token') ?? ''}`
    }
  });

  return next(requestWithAuthToken).pipe(
    retry(2),

    catchError((error: HttpErrorResponse) => {
      console.log('Inside HttpInterceptor Error Object =>', error);
      alert(`HTTP Error: ${error.message}`);
      return throwError(() => error);
    }),

    finalize(() => {
      const profilingMsg = `Method: ${request.method} | URL: ${request.urlWithParams}`;
      console.log('Inside HttpInterceptor PROFILING =>', profilingMsg);
    })
  );
}
