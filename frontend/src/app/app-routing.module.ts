import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guards";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./feature/user/user.module").then(module => module.UserModule)
  },
  {
    path: "contact",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./feature/user/user.module").then(module => module.UserModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
