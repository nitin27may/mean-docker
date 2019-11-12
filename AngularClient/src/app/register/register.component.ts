import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { UserService } from "../core/services/index";
import { AlertService } from "../core/components/index";

@Component({
  templateUrl: "register.component.html",
  styleUrls: ["register.component.scss"]
})
export class RegisterComponent implements OnInit {
  loading = false;
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  register() {
    this.loading = true;
    this.userService.create(this.registerForm.value).subscribe(
      data => {
        this.alertService.success("Registration successful", true);
        this.router.navigate(["/login"]);
        console.log(data);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.createForm();
  }
}
