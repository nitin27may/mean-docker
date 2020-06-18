import { Component, OnInit } from "@angular/core";
import { SortType } from "@swimlane/ngx-datatable";
@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"]
})
export class ContactListComponent implements OnInit {
  SortType = SortType;
  rows = [
    {
      firstName: "Austin",
      lastName: "Austin",
      email: "nitin27may@gmail.com",
      mobile: "9876543783",
      city: "Swimlane",
      postalCode: "M4D1G8"
    },
    { firstName: "Dany", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Dany", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" },
    { firstName: "Molly", lastName: "Austin", email: "nitin27may@gmail.com", mobile: "9876543783", city: "Swimlane", postalCode: "M4D1G8" }
  ];
  columns = [
    { prop: "firstName", name: "First Name" },
    { prop: "lastName" },
    { prop: "email" },
    { prop: "mobile" },
    { prop: "city" },
    { prop: "postalCode" }
  ];
  constructor() {}

  ngOnInit(): void {}
}
