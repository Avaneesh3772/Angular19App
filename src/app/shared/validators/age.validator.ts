import { AbstractControl, ValidationErrors } from '@angular/forms';

export function AgeCustomValidator(control: AbstractControl): ValidationErrors | null {
  if (control.touched && control.value !== null && (control.value < 18 || control.value > 45)) {
    return { ageMismatch: true };
  }
  return null;
}
