import { Component, OnInit } from "@angular/core";
import { SortType } from "@swimlane/ngx-datatable";
import { ContactService } from "../contact.service";
@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"]
})
export class ContactListComponent implements OnInit {
  SortType = SortType;
  contacts: any;

  columns = [
    { prop: "firstName", name: "First Name" },
    { prop: "lastName" },
    { prop: "email" },
    { prop: "mobile" },
    { prop: "city" },
    { prop: "postalCode" }
  ];
  constructor(private contactService: ContactService) {}
  getAll() {
    this.contactService.getAll().subscribe(
      (data) => {
        console.log(data);
        this.contacts = data;
      },

      (error) => {}
    );
  }
  ngOnInit(): void {
    this.getAll();
  }
}
