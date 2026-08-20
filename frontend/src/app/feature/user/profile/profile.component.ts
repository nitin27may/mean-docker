import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../@core/services/notification.service';
import { User } from '../../../@core/models/user.interface';
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
    private readonly notificationService = inject(NotificationService);

    active = 1;
    user: User | null = null;
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

        const currentUser = this.userService.getCurrentUser();
        if (currentUser) {
            this.profileForm.patchValue(currentUser);
        }
    }

    updateProfile(): void {
        const currentUser = this.user;

        if (!currentUser) {
            return;
        }

        this.userService.update(this.profileForm.getRawValue()).subscribe({
            next: (updated) => {
                this.notificationService.success('Profile updated successfully');
                // The update response does not carry the JWT, so preserve the
                // one the session is already authenticated with.
                const user: User = { ...updated, token: currentUser.token };
                this.user = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
            },
            error: () => {
                this.notificationService.error('Failed to update profile');
            }
        });
    }

    resetPasswordForm(): void {
        this.passwordForm.reset();

        if (this.user) {
            this.passwordForm.controls.username.patchValue(this.user.username);
        }
    }

    updatePassword(): void {
        if (!this.user) {
            return;
        }

        this.userService
            .changePassword(
                this.user._id,
                this.passwordForm.controls.password.value
            )
            .subscribe({
                next: () => {
                    this.notificationService.success('Password updated successfully');
                    this.router.navigate(['/login']);
                },
                error: () => {
                    this.notificationService.error('Failed to update password');
                }
            });
    }

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();

        if (!this.user) {
            this.router.navigate(['/login']);
            return;
        }

        this.profileForm.patchValue(this.user);
        this.passwordForm.controls.username.patchValue(this.user.username);
    }
}
