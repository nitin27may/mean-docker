import { Injectable } from "@angular/core";
@Injectable()
export class ValidationService {
  constructor() {}

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config: any = {
      required: "Required",
      invalidCreditCard: "Is invalid credit card number",
      invalidEmailAddress: "Invalid email address",
      invalidMobile: "Invalid Mobile no",
      invalidPassword:
        "Invalid password. Password must be at least 6 characters long, and contain a number.",
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Max length ${validatorValue.requiredLength}`
    };
    return config[validatorName];
  }

  emailValidator(control: any) {
    // RFC 2822 compliant regex
    // tslint:disable-next-line:max-line-length
    if (
      control.value.match(
        /[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  mobileValidator(control: any) {
    // RFC 2822 compliant regex
    if (control.value.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
      return null;
    } else {
      return { invalidMobile: true };
    }
  }
}
