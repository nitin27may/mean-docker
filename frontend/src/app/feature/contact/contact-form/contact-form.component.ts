import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../../@core/services/validation.service';
import { ContactService } from '../contact.service';
import { errorTailorImports } from "../../../@core/components/validation";

interface ContactForm {
    _id: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    mobile: FormControl<string>;
    city: FormControl<string>;
    postalCode: FormControl<string>;
}

@Component({
    selector: 'app-contact-form',
    imports: [ReactiveFormsModule, RouterModule, CommonModule, errorTailorImports],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.css',
    providers: [ContactService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly validationService = inject(ValidationService);
    private readonly contactService = inject(ContactService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly toastrService = inject(ToastrService);

    contactForm: FormGroup<ContactForm>;

    createForm(): void {
        this.contactForm = new FormGroup<ContactForm>({
            _id: new FormControl('', { nonNullable: true }),
            firstName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            }),
            lastName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(35),
                ],
            }),
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, this.validationService.emailValidator],
            }),
            mobile: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
