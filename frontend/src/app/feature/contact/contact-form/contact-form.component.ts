import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ContactService } from "../contact.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ValidationService } from "@core/components/validation-errors/validation-messages.service";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"]
})
export class ContactFormComponent implements OnInit {
  contactForm: UntypedFormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  createForm(): void {
    this.contactForm = this.formBuilder.group({
      _id: ["", []],
      firstName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      lastName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      email: ["", [Validators.required, this.validationService.emailValidator]],
      mobile: ["", [Validators.required]],
      city: ["", [Validators.required]],
      postalCode: ["", [Validators.required]]
    });
  }

  reset(): void {
    const contact = this.contactForm.value;
    if (contact._id) {
      this.getContactDetails();
    } else {
      this.contactForm.reset();
    }

  }
  submit(): void {
    const contact = this.contactForm.value;
    if (contact._id) {
      this.update(contact);
    } else {
      delete contact._id;
      this.save(contact);
    }
  }

  save(contact: any): void {
    this.contactService.create(contact).subscribe(
      (data) => {
        this.toastrService.success("Contact created successfully", "Success");
        this.router.navigate(["/contacts"]);
      },

      (error) => {}
    );
  }
  update(contact: any): void {
    this.contactService.update(contact).subscribe(
      (data) => {
        this.toastrService.success("Contact updated successfully", "Success");
        this.router.navigate(["/contacts"]);
      },

      (error) => {}
    );
  }
  ngOnInit(): void {
    this.createForm();
    this.getContactDetails();
  }

  private getContactDetails() {
    const contactDetails = this.activatedRoute.snapshot.data.contactDetails;
    if (contactDetails) {
      this.contactForm.patchValue(contactDetails);
    }
  }
}
