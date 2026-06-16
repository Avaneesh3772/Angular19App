import { TestBed } from '@angular/core/testing';
import { configureGuardTestBed } from '../testing/test-helpers';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  it('should allow matching (returns true)', () => {
    configureGuardTestBed('rolemanagement');
    const guard = TestBed.inject(RoleGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});
