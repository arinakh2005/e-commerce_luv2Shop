import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidators {
  public static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    const controlValue = control.value;
    const isEmptyControlValue = controlValue === null;
    const isFilledByWhiteSpace = controlValue?.trim().length === 0;
    const isFailedByValidator = (!isEmptyControlValue && isFilledByWhiteSpace);

    return isFailedByValidator
      ? { 'notOnlyWhiteSpace': true }
      : null;
  }
}
