import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationService } from "../../../core/components";
import { ContactService } from "../contact.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private contactService: ContactService
  ) {}

  createForm() {
    this.contactForm = this.formBuilder.group({
      _id: ["", []],
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
  submit() {
    const contact = this.contactForm.value;
    if (contact._id) {
      this.update(contact);
    } else {
      delete contact._id;
      this.save(contact);
    }
  }

  save(contact: any) {
    this.contactService.create(contact).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(["/contacts"]);
      },

      (error) => {}
    );
  }
  update(contact: any) {
    this.contactService.update(contact).subscribe(
      (data) => {},

      (error) => {}
    );
  }
  ngOnInit() {
    this.createForm();
  }
}
