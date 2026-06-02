import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  it('should allow matching (returns true)', () => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(AdminGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});

