import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { AuthenticationService } from "../core/services/index";
import { AlertService } from "../core/components/index";

@Component({
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // reset login status
    this.createForm();
    this.authenticationService.logout();

    // get return url from route parameters or default to "/"
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login(loginForm: FormGroup) {
    if (loginForm.valid) {
      this.loading = true;
      this.authenticationService
        .login(
          loginForm.controls.userName.value,
          loginForm.controls.password.value
        )
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
            console.log(data);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    } else {
      this.alertService.error("Please enter valid credentails");
    }
  }
}
