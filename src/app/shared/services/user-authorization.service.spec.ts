import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConstants } from '../constants/app.constants';
import { UserPersonalInfo } from '../models/app.models';
import { HTTP_TEST_PROVIDERS } from '../testing/test-helpers';
import { UserAuthorizationService } from './user-authorization.service';

describe('UserAuthorizationService', () => {
  let service: UserAuthorizationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(UserAuthorizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getAppConfigData ──────────────────────────────────────────────────────
  it('should call getAppConfigData and return user configuration', () => {
    const mockConfig: UserPersonalInfo = {
      employeeNumber: 339803934,
      firstname: 'Avaneesh',
      lastname: 'Mishra',
      roles: ['dashboard', 'templates', 'admin', 'rolemanagement', 'restatement'],
    };

    let result: UserPersonalInfo | undefined;
    service.getAppConfigData(AppConstants.appConfigDataURL).subscribe(data => {
      result = data;
    });

    const req = httpMock.expectOne(AppConstants.appConfigDataURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    expect(result).toEqual(mockConfig);
    expect(result?.firstname).toBe('Avaneesh');
    expect(result?.lastname).toBe('Mishra');
    expect(result?.roles).toContain('dashboard');
    expect(result?.roles.length).toBe(5);
  });

  it('should handle HTTP error in getAppConfigData', () => {
    let errorReceived: unknown = null;

    service.getAppConfigData(AppConstants.appConfigDataURL).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => { errorReceived = err; },
    });

    const req = httpMock.expectOne(AppConstants.appConfigDataURL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
  });
});
