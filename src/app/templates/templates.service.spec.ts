import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../shared/testing/test-helpers';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(TemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
