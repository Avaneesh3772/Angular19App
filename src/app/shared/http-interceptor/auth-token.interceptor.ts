import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
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
    // Only retry on server errors (5xx), not on client errors (4xx)
    retry({
      count: 2,
      delay: (error: HttpErrorResponse) => {
        if (error.status >= HttpStatusCode.InternalServerError) {
          return [error];
        }
        throw error;
      }
    }),

    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Interceptor — request failed:', error.status, error.message);
      return throwError(() => error);
    }),

    finalize(() => {
      const profilingMsg = `${request.method} ${request.urlWithParams}`;
      console.log('HTTP Interceptor — completed:', profilingMsg);
    })
  );
}
