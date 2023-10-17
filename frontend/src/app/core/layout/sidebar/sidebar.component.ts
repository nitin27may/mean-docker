import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { LoginService } from "../../../feature/user/login/login.service";
import { User } from "../../models/user.interface";
import { UserService } from "../../services";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;

  user: User;

  @Output() collapsedEvent = new EventEmitter<boolean>();

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
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = "";
    this.pushRightClass = "push-right";
    this.user = this.userService.getCurrentUser();
  }

  eventCalled(): void {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any): void {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar(): void {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }
  onLoggedout(): void  {
    this.loginService.logout();
   }
}
