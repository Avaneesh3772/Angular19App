import { TestBed } from '@angular/core/testing';
import { configureGuardTestBed } from '../testing/test-helpers';
import { DashboardGuard } from './dashboard.guard';

describe('DashboardGuard', () => {
  it('should allow matching (returns true)', () => {
    configureGuardTestBed('dashboard');
    const guard = TestBed.inject(DashboardGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});
