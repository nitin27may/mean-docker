import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "./login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // reset login status
    this.createForm();
    this.loginService.logout();

    // get return url from route parameters or default to "/"
    this.returnUrl = this.route.snapshot.queryParams[`returnUrl`] || "/";
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false]
    });
  }

  login(loginForm: UntypedFormGroup): void {
    if (loginForm.valid) {
      this.loading = true;
      this.loginService
        .login(
          loginForm.controls.userName.value,
          loginForm.controls.password.value
        )
        .subscribe(
          data => {
            this.loading = false;
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.toastrService.error(error);
            this.loading = false;
          }
        );
    } else {
      this.toastrService.error("Please enter valid credentails");
    }
  }
}
