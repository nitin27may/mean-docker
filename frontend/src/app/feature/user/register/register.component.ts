import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../@core/services/user.service';
import { ValidationService } from '../../../@core/services/validation.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
    loading = false;
    registerForm: UntypedFormGroup;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private userService: UserService,
        private toastrService: ToastrService,
        private validationService: ValidationService
    ) {
        this.registerForm = this.createForm();
    }

    register(): void {
        this.loading = true;
        this.userService.create(this.registerForm.value).subscribe(
            (data) => {
                this.toastrService.success('Registration successful');
                this.router.navigate(['/login']);
                console.log(data);
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    createForm(): UntypedFormGroup {
        return this.formBuilder.group(
            {
                firstName: [null, { validators: [Validators.required] }],
                lastName: [null, { validators: [Validators.required] }],
                username: [
                    null,
                    {
                        validators: [
                            Validators.required,
                            this.validationService.emailValidator,
                        ],
                    },
                ],
                password: [
                    null,
                    {
                        validators: [
                            Validators.required,
                            Validators.minLength(6),
                        ],
                    },
                ],
                confirmPassword: [null, { validators: [Validators.required] }],
            },
            {
                validator: this.validationService.MustMatch(
                    'password',
                    'confirmPassword'
                ),
            }
        );
    }
    ngOnInit(): void {}
}
