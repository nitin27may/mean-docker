import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { LoginService } from "../../../feature/user/login/login.service";
import { User } from "../../models/user.interface";
import { UserService } from "../../services";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public pushRightClass: string;
  user: User;

  constructor(
    public router: Router,
    private userService: UserService,
    private loginService: LoginService) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit(): void {
    this.pushRightClass = "push-right";
    this.user = this.userService.getCurrentUser();
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar(): void  {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }
  onLoggedout(): void  {
   this.loginService.logout();
  }
}
