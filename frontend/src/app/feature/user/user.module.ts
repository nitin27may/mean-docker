import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { UserRoutingModule } from "./user-routing.module";
import { LoginService } from "./login/login.service";
import { CoreModule } from "../../../app/core/core.module";
import { SharedModule } from "../../../app/shared/shared.module";
import { ProfileComponent } from "./profile/profile.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HomeComponent, ProfileComponent],
  imports: [UserRoutingModule, HttpClientModule, CoreModule.forRoot(), SharedModule.forRoot()],
  providers: [LoginService],
  bootstrap: []
})
export class UserModule {}
