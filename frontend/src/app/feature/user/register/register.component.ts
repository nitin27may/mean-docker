import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private readonly toastrService = inject(ToastrService);
    private readonly validationService = inject(ValidationService);

    loading = signal(false);
    registerForm = this.createForm();

    register(): void {
        this.loading.set(true);
        this.userService.create(this.registerForm.getRawValue() as any).subscribe({
            next: (data) => {
                this.toastrService.success('Registration successful');
                this.router.navigate(['/login']);
                console.log(data);
            },
            error: () => {
                this.loading.set(false);
            }
        });
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
