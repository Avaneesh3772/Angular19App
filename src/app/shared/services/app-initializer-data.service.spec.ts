import { TestBed } from '@angular/core/testing';

import { AppInitializerDataService } from './app-initializer-data.service';

describe('AppInitializerDataService', () => {
  let service: AppInitializerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitializerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
