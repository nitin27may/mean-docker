import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationService } from "../../../core/components";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"]
})
export class ContactFormComponent implements OnInit {
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private validationService: ValidationService) {}

  createForm() {
    this.userForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      lastName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      email: ["", [Validators.required, this.validationService.emailValidator]],
      mobile: ["", [Validators.required, this.validationService.mobileValidator]],
      city: ["", [Validators.required]],
      postalCode: ["", [Validators.required]]
    });
  }

  reset() {
    this.createForm();
  }

  cancel() {}
  ngOnInit() {
    this.createForm();
  }
}
