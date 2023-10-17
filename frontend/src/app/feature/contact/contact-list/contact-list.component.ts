import { Component, OnInit } from "@angular/core";
import { SortType, SelectionType } from "@swimlane/ngx-datatable";
import { ContactService } from "../contact.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"]
})
export class ContactListComponent implements OnInit {
  SortType = SortType;
  contacts: any;
  selected = [];
  SelectionType = SelectionType;

  columns = [
    { prop: "firstName", name: "First Name",  width: 250 },
    { prop: "lastName",  width: 250  },
    { prop: "email",  width: 250  },
    { prop: "mobile" },
    { prop: "city" },
    { prop: "postalCode" }
  ];
  constructor(private contactService: ContactService, private router: Router) {}
  getAll(): void {
    this.contactService.getAll().subscribe(
      (data) => {
        console.log(data);
        this.contacts = data;
      },

      (error) => {}
    );
  }
  onSelect(selected: any): void {
    console.log("Select Event", selected, this.selected);
    this.router.navigate(["/contacts/details/" + this.selected[0]._id]);
  }
  ngOnInit(): void {
    this.getAll();
  }
}
