import { TestBed } from '@angular/core/testing';
import { configureGuardTestBed } from '../testing/test-helpers';
import { TemplateGuard } from './template.guard';

describe('TemplateGuard', () => {
  it('should allow matching (returns true)', () => {
    configureGuardTestBed('templates');
    const guard = TestBed.inject(TemplateGuard);
    expect(guard.canMatch()).toBeTrue();
  });
});
