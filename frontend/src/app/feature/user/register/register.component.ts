import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../@core/services/notification.service';
import { NewUser } from '../../../@core/models/user.interface';
import { UserService } from '../../../@core/services/user.service';
import { ValidationService } from '../../../@core/services/validation.service';

interface RegisterForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}

@Component({
    selector: 'app-register',
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);
    private readonly validationService = inject(ValidationService);

    loading = signal(false);
    registerForm = this.createForm();

    register(): void {
        this.loading.set(true);
        this.userService.create(this.buildPayload()).subscribe({
            next: () => {
                this.notificationService.success('Registration successful');
                this.router.navigate(['/login']);
            },
            error: () => {
                this.notificationService.error('Registration failed');
                this.loading.set(false);
            }
        });
    }

    /**
     * The form carries a confirmPassword the API has no field for, and the API
     * needs an email it derives from the username. Map explicitly rather than
     * casting the raw form value.
     */
    private buildPayload(): NewUser {
        const { firstName, lastName, username, password } = this.registerForm.getRawValue();

        return {
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            username: username ?? '',
            email: username ?? '',
            mobile: '',
            password: password ?? ''
        };
    }

    createForm(): FormGroup<RegisterForm> {
        return new FormGroup<RegisterForm>(
            {
                firstName: new FormControl(null, { validators: [Validators.required] }),
                lastName: new FormControl(null, { validators: [Validators.required] }),
                username: new FormControl(null, {
                    validators: [
                        Validators.required,
                        this.validationService.emailValidator,
                    ],
                }),
                password: new FormControl(null, {
                    validators: [
                        Validators.required,
                        Validators.minLength(6),
                    ],
                }),
                confirmPassword: new FormControl(null, { validators: [Validators.required] }),
            },
            {
                validators: this.validationService.MustMatch(
                    'password',
                    'confirmPassword'
                ),
            }
        );
    }
}
