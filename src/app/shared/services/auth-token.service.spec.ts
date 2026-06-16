import { TestBed } from '@angular/core/testing';
import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
  let service: AuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTokenService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve a token from sessionStorage', () => {
    service.setTokenToSessionStorage('token', 'my-test-token');
    const retrieved = service.getTokenFromSessionStorage('token');
    expect(retrieved).toBe('my-test-token');
  });

  it('should return null when key does not exist', () => {
    const result = service.getTokenFromSessionStorage('missing-key');
    expect(result).toBeNull();
  });
});
