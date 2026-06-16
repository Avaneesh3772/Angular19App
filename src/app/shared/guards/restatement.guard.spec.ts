import { TestBed } from '@angular/core/testing';
import { configureGuardTestBed } from '../testing/test-helpers';
import { RestatementGuard } from './restatement.guard';

describe('RestatementGuard', () => {
  it('should allow matching (returns true)', () => {
    configureGuardTestBed('restatement');
    const guard = TestBed.inject(RestatementGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});
