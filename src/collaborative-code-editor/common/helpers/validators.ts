import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static matchFieldsValidator(field: string, matchingField: string, errorKey: string = 'fieldsMismatch'): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fieldControl = group.get(field);
      const matchingControl = group.get(matchingField);

      if (!fieldControl || !matchingControl) {
        return null;
      }

      const fieldValue = fieldControl.value;
      const matchingValue = matchingControl.value;

      if (!fieldValue || !matchingValue) {
        matchingControl.setErrors(null);
        return null;
      }

      if (fieldValue !== matchingValue) {
        matchingControl.setErrors({
          ...(matchingControl.errors ?? {}),
          [errorKey]: true
        });
        return { [errorKey]: true };
      }

      if (matchingControl.hasError(errorKey)) {
        const errors = { ...(matchingControl.errors ?? {}) };
        delete errors[errorKey];

        matchingControl.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }

      return null;
    }
  }
}

