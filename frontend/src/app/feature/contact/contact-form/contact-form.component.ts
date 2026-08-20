import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { errorTailorImports } from '../../../@core/components/validation';
import { NotificationService } from '../../../@core/services/notification.service';
import { ValidationService } from '../../../@core/services/validation.service';
import { Contact, NewContact } from '../contact.interface';
import { ContactService } from '../contact.service';

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
    imports: [ReactiveFormsModule, RouterModule, errorTailorImports],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.css',
    providers: [ContactService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly validationService = inject(ValidationService);
    private readonly contactService = inject(ContactService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly notificationService = inject(NotificationService);

    contactForm!: FormGroup<ContactForm>;

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
                validators: [
                    Validators.required,
                    this.validationService.emailValidator,
                ],
            }),
            mobile: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            city: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            postalCode: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
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
        // getRawValue() rather than value: every control is nonNullable, so
        // this is the full Contact shape rather than a Partial.
        const contact = this.contactForm.getRawValue();

        if (contact._id) {
            this.update(contact);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- drops the empty _id
            const { _id, ...newContact } = contact;
            this.save(newContact);
        }
    }

    save(contact: NewContact): void {
        this.contactService.create(contact).subscribe({
            next: () => {
                this.notificationService.success(
                    'Contact created successfully'
                );
                this.router.navigate(['/contacts']);
            },
            error: () => {
                this.notificationService.error('Failed to create contact');
            },
        });
    }
    update(contact: Contact): void {
        this.contactService.update(contact).subscribe({
            next: () => {
                this.notificationService.success(
                    'Contact updated successfully'
                );
                this.router.navigate(['/contacts']);
            },
            error: () => {
                this.notificationService.error('Failed to update contact');
            },
        });
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
