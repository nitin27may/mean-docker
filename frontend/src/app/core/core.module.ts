import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";

import { AlertComponent, AlertService, ValidationMessagesComponent, ValidationService } from "./components/index";
import { AuthGuard } from "./guards/index";
import { JwtInterceptorProvider, ErrorInterceptorProvider } from "./helpers/index";
import { LayoutModule } from "./layout/layout.module";
import { UserService } from "./services";

@NgModule({
  imports: [CommonModule, HttpClientModule, ToastrModule.forRoot(), LayoutModule],
  declarations: [AlertComponent, ValidationMessagesComponent],
  exports: [AlertComponent, ValidationMessagesComponent, ToastrModule, LayoutModule]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [AuthGuard, UserService, AlertService, ValidationService, JwtInterceptorProvider, ErrorInterceptorProvider, ToastrService]
    };
  }
}
