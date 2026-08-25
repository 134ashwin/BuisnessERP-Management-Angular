import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validators
 * Reusable validation functions for Reactive Forms
 */

export class CustomValidators {
  /**
   * Password strength validator
   * Password must contain: uppercase, lowercase, number, special char, min 8 chars
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      const isLongEnough = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLongEnough;

      if (!passwordValid) {
        return {
          passwordStrength: {
            hasUpperCase,
            hasLowerCase,
            hasNumeric,
            hasSpecialChar,
            isLongEnough
          }
        };
      }

      return null;
    };
  }

  /**
   * Email format validator (more comprehensive than default)
   */
  static emailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);

      return isValid ? null : { email: true };
    };
  }

  /**
   * Match fields validator (useful for password confirmation)
   */
  static matchFields(fieldName: string, matchingFieldName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const field = formGroup.get(fieldName);
      const matchingField = formGroup.get(matchingFieldName);

      if (!field || !matchingField) {
        return null;
      }

      return field.value === matchingField.value ? null : { fieldsNotMatching: true };
    };
  }

  /**
   * No whitespace validator
   */
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace && control.value ? { whitespace: true } : null;
    };
  }
}
