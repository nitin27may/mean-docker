import { NgModule } from "@angular/core";
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';

@NgModule({
  declarations: [ContactFormComponent, ContactListComponent, ContactDetailsComponent],
  imports: [],
  providers: [],
  bootstrap: []
})
export class ContactModule {}
