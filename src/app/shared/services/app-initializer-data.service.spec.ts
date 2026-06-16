import { TestBed } from '@angular/core/testing';
import { HTTP_TEST_PROVIDERS } from '../testing/test-helpers';
import { AppInitializerDataService } from './app-initializer-data.service';

describe('AppInitializerDataService', () => {
  let service: AppInitializerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...HTTP_TEST_PROVIDERS],
    });
    service = TestBed.inject(AppInitializerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
