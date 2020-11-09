import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../core/components';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  createForm() {
    this.contactForm = this.formBuilder.group({
      _id: ['', []],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      email: ['', [Validators.required, this.validationService.emailValidator]],
      mobile: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]]
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
        this.toastrService.success('Contact created successfully', 'Success');
        this.router.navigate(['/contacts']);
      },

      (error) => {}
    );
  }
  update(contact: any) {
    this.contactService.update(contact).subscribe(
      (data) => {
        this.toastrService.success('Contact updated successfully', 'Success');
        this.router.navigate(['/contacts']);
      },

      (error) => {}
    );
  }
  ngOnInit() {
    this.createForm();
    const contactDetails = this.activatedRoute.snapshot.data.contactDetails;
    if (contactDetails) {
      this.contactForm.patchValue(contactDetails);
    }
  }
}
