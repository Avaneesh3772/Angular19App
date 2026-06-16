import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from './shared/testing/test-helpers';
import { WebApiService } from './web-api.service';

describe('WebApiService', () => {
  let service: WebApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(WebApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
