import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../testing/test-helpers';
import { UserAuthorizationService } from './user-authorization.service';

describe('UserAuthorizationService', () => {
  let service: UserAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(UserAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
