import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "../../../app/core/layout/layout.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactDetailsComponent } from "./contact-details/contact-details.component";
import { ContactDetailsResolver } from "./contact.resolver";

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
        path: "edit/:contactId",
        component: ContactFormComponent,
        resolve: { contactDetails: ContactDetailsResolver }
      },
      {
        path: "details/:contactId",
        component: ContactDetailsComponent,
        resolve: { contactDetails: ContactDetailsResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(contactRoutes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}
