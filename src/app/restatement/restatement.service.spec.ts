import { TestBed } from '@angular/core/testing';

import { RestatementService } from './restatement.service';

describe('RestatementService', () => {
  let service: RestatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
