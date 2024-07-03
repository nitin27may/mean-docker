import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../../@core/services/validation.service';
import { ContactService } from '../contact.service';
import { errorTailorImports } from "../../../@core/components/validation";

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, CommonModule,errorTailorImports],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.css',
    providers: [ContactService],
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
            _id: ['', []],
            firstName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            ],
            lastName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            ],
            email: [
                '',
                [Validators.required, this.validationService.emailValidator],
            ],
            mobile: ['', [Validators.required]],
            city: ['', [Validators.required]],
            postalCode: ['', [Validators.required]],
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
                this.toastrService.success(
                    'Contact created successfully',
                    'Success'
                );
                this.router.navigate(['/contacts']);
            },

            (error) => {}
        );
    }
    update(contact: any): void {
        this.contactService.update(contact).subscribe(
            (data) => {
                this.toastrService.success(
                    'Contact updated successfully',
                    'Success'
                );
                this.router.navigate(['/contacts']);
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
