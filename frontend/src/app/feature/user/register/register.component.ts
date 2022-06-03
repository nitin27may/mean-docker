import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ValidationService } from "@core/components/validation-errors/validation-messages.service";
import { UserService } from "@core/services/user.service";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  loading = false;
  registerForm: UntypedFormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private validationService: ValidationService,
    private toastrService: ToastrService
  ) {}

  register(): void {
    this.loading = true;
    this.userService.create(this.registerForm.value).subscribe(
      (data) => {
        this.toastrService.success("Registration successful");
        this.router.navigate(["/login"]);
        console.log(data);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  createForm(): UntypedFormGroup {
   return this.formBuilder.group({
        firstName: [ null,{ validators: [ Validators.required]}],
        lastName: [null,{ validators: [ Validators.required]}],
        username: [null, { validators: [Validators.required, this.validationService.emailValidator ]}],
        password: [null,{ validators: [Validators.required, Validators.minLength(6)]}],
        confirmPassword: [null,{ validators: [ Validators.required]}]
      },
      {
        validator: this.validationService.MustMatch("password", "confirmPassword")
      }
    );
  }
  ngOnInit(): void {
    this.registerForm =  this.createForm();
  }
}
