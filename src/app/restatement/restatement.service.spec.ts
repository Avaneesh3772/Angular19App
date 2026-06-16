import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { RestatementService } from './restatement.service';

describe('RestatementService', () => {
  let service: RestatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(RestatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
