import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
