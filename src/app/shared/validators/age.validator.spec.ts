import { FormControl } from '@angular/forms';
import { AgeCustomValidator } from './age.validator';

/**
 * UNIT TEST — AgeCustomValidator
 *
 * Validators are PURE FUNCTIONS — no TestBed, no HTTP, no mocks needed.
 * Pass a FormControl (or FormGroup) and check the return value:
 *   null              → valid (no error)
 *   { ageMismatch: true } → invalid
 *
 * AgeCustomValidator rules:
 *   - Only runs when control.touched === true
 *   - Only runs when value !== null
 *   - Invalid when value < 18 OR value > 45
 *
 * Pattern for testing any FormControl validator:
 *   1. new FormControl(value)
 *   2. control.markAsTouched()   ← required for this validator
 *   3. expect(AgeCustomValidator(control)).toEqual(...) or .toBeNull()
 */
describe('AgeCustomValidator', () => {

  // Helper — creates a touched control with a given age value
  function touchedControl(value: number | null): FormControl {
    const control = new FormControl(value);
    control.markAsTouched();
    return control;
  }

  // ─── Valid cases ───────────────────────────────────────────────────────────
  it('should return null for a valid age (30)', () => {
    expect(AgeCustomValidator(touchedControl(30))).toBeNull();
  });

  it('should return null for minimum valid age (18)', () => {
    expect(AgeCustomValidator(touchedControl(18))).toBeNull();
  });

  it('should return null for maximum valid age (45)', () => {
    expect(AgeCustomValidator(touchedControl(45))).toBeNull();
  });

  // ─── Invalid cases (touched) ───────────────────────────────────────────────
  it('should return ageMismatch when age is below 18', () => {
    expect(AgeCustomValidator(touchedControl(17))).toEqual({ ageMismatch: true });
  });

  it('should return ageMismatch when age is above 45', () => {
    expect(AgeCustomValidator(touchedControl(46))).toEqual({ ageMismatch: true });
  });

  it('should return ageMismatch for age 0', () => {
    expect(AgeCustomValidator(touchedControl(0))).toEqual({ ageMismatch: true });
  });

  // ─── Skipped validation (not touched / null) ───────────────────────────────
  it('should return null when control is NOT touched (even if age is invalid)', () => {
    const control = new FormControl(10); // invalid age, but not touched
    expect(AgeCustomValidator(control)).toBeNull();
  });

  it('should return null when value is null (even if touched)', () => {
    expect(AgeCustomValidator(touchedControl(null))).toBeNull();
  });

});
