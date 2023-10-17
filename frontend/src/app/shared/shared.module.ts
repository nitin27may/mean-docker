import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BootstrapModule } from "./bootstrap.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, BootstrapModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, BootstrapModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
