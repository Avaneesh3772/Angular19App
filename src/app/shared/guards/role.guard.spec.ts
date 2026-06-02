import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  it('should allow matching (returns true)', () => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(RoleGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});

