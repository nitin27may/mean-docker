import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { LoginService } from "../../../feature/user/login/login.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbDropdownModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [ LoginService]
})
export class HeaderComponent implements OnInit{
  user: any;
  constructor(private userService: UserService,
private loginService: LoginService
  ){}
  logOut(){
    this.loginService.logout();

  }
  ngOnInit(){
    this.user = this.userService.getCurrentUser();
    //this.user = {firstName: "John", lastName: "Doe"};
  }
}
