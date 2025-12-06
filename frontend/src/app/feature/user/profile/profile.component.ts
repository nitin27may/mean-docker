import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../@core/services/user.service';
import { ValidationService } from '../../../@core/services/validation.service';

interface ProfileForm {
    _id: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    mobile: FormControl<string>;
}

interface PasswordForm {
    username: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-profile',
    imports: [NgbNavModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly validationService = inject(ValidationService);
    private readonly toastrService = inject(ToastrService);

    active = 1;
    user: any;
    profileForm = this.createProfileForm();
    passwordForm = this.createPasswordForm();

    createProfileForm(): FormGroup<ProfileForm> {
        return new FormGroup<ProfileForm>({
            _id: new FormControl('', { nonNullable: true }),
            firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            mobile: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
        });
    }

    createPasswordForm(): FormGroup<PasswordForm> {
        return new FormGroup<PasswordForm>(
            {
                username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
                password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
                confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            },
            {
                validators: this.validationService.MustMatch(
                    'password',
                    'confirmPassword'
                ),
            }
        );
    }

    resetProfileForm(): void {
        this.profileForm.reset();
        this.profileForm.patchValue(this.userService.getCurrentUser());
    }

    updateProfile(): void {
        this.userService.update(this.profileForm.getRawValue() as any).subscribe({
            next: (data) => {
                this.toastrService.success('Profile updated successfully');
                const user = data;
                user.token = this.user.token;
                localStorage.setItem('currentUser', JSON.stringify(user));
            },
            error: () => { }
        });
    }

    resetPasswordForm(): void {
        this.passwordForm.reset();
        this.passwordForm.controls.username.patchValue(this.user.username);
    }

    updatePassword(): void {
        this.userService
            .changePassword(
                this.user._id,
                this.passwordForm.controls.password.value
            )
            .subscribe({
                next: () => {
                    this.toastrService.success('Password updated successfully');
                    this.router.navigate(['/login']);
                },
                error: () => { }
            });
    }

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();
        this.profileForm.patchValue(this.user);
        this.passwordForm.controls.username.patchValue(this.user.username);
    }
}
