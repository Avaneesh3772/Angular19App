import { FormControl, FormGroup } from '@angular/forms';
import { PasswordValidator } from './password.validator';

/**
 * UNIT TEST — PasswordValidator
 *
 * Unlike AgeCustomValidator (single FormControl), PasswordValidator is a
 * FormGroup-level validator — it compares two child controls:
 *   control.get('password')
 *   control.get('confirmPassword')
 *
 * Pattern:
 *   1. Build a FormGroup with both fields
 *   2. Call PasswordValidator(formGroup)
 *   3. Assert null (valid) or { passwordMismatch: true } (invalid)
 *
 * Note: This validator does NOT check .touched — only whether both
 * fields have values and whether they match.
 */
describe('PasswordValidator', () => {

  /** Helper — builds a FormGroup with password + confirmPassword fields */
  function passwordGroup(password: string, confirmPassword: string): FormGroup {
    return new FormGroup({
      password: new FormControl(password),
      confirmPassword: new FormControl(confirmPassword),
    });
  }

  // ─── Valid cases ───────────────────────────────────────────────────────────
  it('should return null when passwords match', () => {
    expect(PasswordValidator(passwordGroup('password123', 'password123'))).toBeNull();
  });

  it('should return null when password is empty', () => {
    expect(PasswordValidator(passwordGroup('', 'confirm123'))).toBeNull();
  });

  it('should return null when confirmPassword is empty', () => {
    expect(PasswordValidator(passwordGroup('password123', ''))).toBeNull();
  });

  it('should return null when both fields are empty', () => {
    expect(PasswordValidator(passwordGroup('', ''))).toBeNull();
  });

  // ─── Invalid cases ─────────────────────────────────────────────────────────
  it('should return passwordMismatch when passwords do not match', () => {
    expect(PasswordValidator(passwordGroup('password123', 'different'))).toEqual({ passwordMismatch: true });
  });

  it('should return passwordMismatch when confirmPassword is similar but not exact', () => {
    expect(PasswordValidator(passwordGroup('Password123', 'password123'))).toEqual({ passwordMismatch: true });
  });

});
