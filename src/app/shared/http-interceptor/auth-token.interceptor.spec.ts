import { HttpErrorResponse, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authTokenInterceptor } from './auth-token.interceptor';
import { AuthTokenService } from '../services/auth-token.service';

describe('authTokenInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let authTokenService: AuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    authTokenService = TestBed.inject(AuthTokenService);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should attach Authorization header when token exists', () => {
    authTokenService.setTokenToSessionStorage('token', 'test-token');

    const { HttpClient } = require('@angular/common/http');
    const http = TestBed.inject(HttpClient);
    http.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush({});
  });

  it('should attach empty Bearer when no token in sessionStorage', () => {
    const { HttpClient } = require('@angular/common/http');
    const http = TestBed.inject(HttpClient);
    http.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ');
    req.flush({});
  });
});
