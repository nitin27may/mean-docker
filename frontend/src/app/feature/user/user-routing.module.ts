import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "@core/guards";
import { LayoutComponent } from "@core/layout/layout.component";
import { ProfileComponent } from "./profile/profile.component";

const userRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
