import { NgModule } from "@angular/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactDetailsComponent } from "./contact-details/contact-details.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";
import { ContactRoutingModule } from "./contact-routing.module";
import { ContactService } from "./contact.service";

@NgModule({
  declarations: [ContactFormComponent, ContactListComponent, ContactDetailsComponent],
  imports: [ContactRoutingModule, NgxDatatableModule, ReactiveFormsModule, CoreModule.forRoot(), SharedModule.forRoot()],
  providers: [ContactService],
  bootstrap: []
})
export class ContactModule {}
