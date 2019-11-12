import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BootstrapModule } from "./bootstrap.module";
import { AppComponent } from "./app.component";

import { HomeComponent } from "./home/index";
import { LoginComponent } from "./login/index";
import { RegisterComponent } from "./register/index";
import { routing } from "./app.routing";
import { CoreModule } from "./core/core.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule.forRoot(),
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
