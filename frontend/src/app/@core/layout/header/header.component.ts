import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from "../../../feature/user/login/login.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'app-header',
    imports: [RouterModule, NgbDropdownModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
  providers: [LoginService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly loginService = inject(LoginService);

  user: any;

  logOut(): void {
    this.loginService.logout();
    }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    }
}
