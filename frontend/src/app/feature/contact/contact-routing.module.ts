import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../../app/core/guards";
import { LayoutComponent } from "../../../app/core/layout/layout.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactDetailsComponent } from "./contact-details/contact-details.component";

const contactRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: ContactListComponent
      },
      {
        path: "create",
        component: ContactFormComponent
      },
      {
        path: "edit/:id",
        component: ContactFormComponent
      },
      {
        path: "details/:id",
        component: ContactDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(contactRoutes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}
