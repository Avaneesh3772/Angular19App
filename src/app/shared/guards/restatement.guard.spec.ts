import { TestBed } from '@angular/core/testing';
import { RestatementGuard } from './restatement.guard';

describe('RestatementGuard', () => {
  it('should allow matching (returns true)', () => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(RestatementGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});

