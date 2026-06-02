import { TestBed } from '@angular/core/testing';
import { TemplateGuard } from './template.guard';

describe('TemplateGuard', () => {
  it('should allow matching (returns true)', () => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(TemplateGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});

