import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";

import { AlertComponent, AlertService, ValidationMessagesComponent, ValidationService } from "./components/index";
import { AuthGuard } from "./guards/index";
import { JwtInterceptorProvider, ErrorInterceptorProvider } from "./helpers/index";

@NgModule({
  imports: [CommonModule, HttpClientModule, ToastrModule.forRoot()],
  declarations: [AlertComponent, ValidationMessagesComponent],
  exports: [AlertComponent, ValidationMessagesComponent, ToastrModule]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [AuthGuard, AlertService, ValidationService, JwtInterceptorProvider, ErrorInterceptorProvider, ToastrService]
    };
  }
}
