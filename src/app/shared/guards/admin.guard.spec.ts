import { TestBed } from '@angular/core/testing';
import { configureGuardTestBed } from '../testing/test-helpers';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  it('should allow matching (returns true)', () => {
    configureGuardTestBed('admin');
    const guard = TestBed.inject(AdminGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});
