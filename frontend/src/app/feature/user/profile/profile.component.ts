import { Component, OnInit } from '@angular/core';

import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../@core/services/user.service';
import { ValidationService } from '../../../@core/services/validation.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbNavModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    active = 1;
    user: any;
    profileForm: UntypedFormGroup;
    passwordForm: UntypedFormGroup;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private userService: UserService,
        private validationService: ValidationService,
        private toastrService: ToastrService
    ) {
        this.createProfileForm();
        this.createPasswordForm();
    }

    createProfileForm(): UntypedFormGroup {
        return (this.profileForm = this.formBuilder.group({
            _id: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.minLength(10)]],
        }));
    }
    createPasswordForm() {
        return (this.passwordForm = this.formBuilder.group(
            {
                username: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required],
            },
            {
                validator: this.validationService.MustMatch(
                    'password',
                    'confirmPassword'
                ),
            }
        ));
    }

    resetProfileForm() {
        this.profileForm.reset();
        this.profileForm.patchValue(this.userService.getCurrentUser());
    }
    updateProfile() {
        this.userService.update(this.profileForm.value).subscribe(
            (data) => {
                this.toastrService.success('Profile updated successful');
                const user = data;
                user.token = this.user.token;
                localStorage.setItem('currentUser', JSON.stringify(user));
            },
            (error) => {}
        );
    }

    resetPasswordForm() {
        this.passwordForm.reset();
        this.passwordForm.get('username').patchValue(this.user.username);
    }
    updatePassword() {
        this.userService
            .changePassword(
                this.user._id,
                this.passwordForm.get('password').value
            )
            .subscribe(
                (data) => {
                    this.toastrService.success('Profile updated successful');
                    this.router.navigate(['/login']);
                },
                (error) => {}
            );
    }

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();
        this.profileForm.patchValue(this.user);
        this.passwordForm.get('username').patchValue(this.user.username);
    }
}
