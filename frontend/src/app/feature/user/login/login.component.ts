import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './login.service';

interface LoginForm {
    userName: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [RouterModule, ReactiveFormsModule],
    providers: [LoginService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly loginService = inject(LoginService);
    private readonly toastrService = inject(ToastrService);

    loading = signal(false);
    returnUrl = '';
    loginForm: FormGroup<LoginForm>;

    ngOnInit(): void {
        this.createForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    createForm(): void {
        this.loginForm = new FormGroup<LoginForm>({
            userName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            rememberMe: new FormControl(false, { nonNullable: true }),
        });
    }

    login(): void {
        if (this.loginForm.valid) {
            this.loading.set(true);
            this.loginService
                .login(
                    this.loginForm.controls.userName.value,
                    this.loginForm.controls.password.value
                )
                .subscribe({
                    next: () => {
                        this.loading.set(false);
                        this.router.navigate([this.returnUrl]);
                    },
                    error: (error) => {
                        this.toastrService.error(error);
                        this.loading.set(false);
                    }
                });
        } else {
            this.toastrService.error('Please enter valid credentials');
        }
    }
}
