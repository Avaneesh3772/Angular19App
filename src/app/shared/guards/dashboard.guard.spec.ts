import { TestBed } from '@angular/core/testing';
import { DashboardGuard } from './dashboard.guard';

describe('DashboardGuard', () => {
  it('should allow matching (returns true)', () => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(DashboardGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});

