import { ModuleWithProviders, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SharedModule } from "../../shared/shared.module";
import { LoginService } from "../../feature/user/login/login.service";

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, SidebarComponent],
  imports: [RouterModule, CommonModule, SharedModule],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, SidebarComponent],
  providers: [LoginService]
})
export class LayoutModule {
  static forRoot(): ModuleWithProviders<LayoutModule> {
    return {
      ngModule: LayoutModule,
      providers: []
    };
  }
}
