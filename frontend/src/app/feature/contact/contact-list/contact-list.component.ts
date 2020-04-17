import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"]
})
export class ContactListComponent implements OnInit {
  rows = [
    { name: "Austin", gender: "Male", company: "Swimlane" },
    { name: "Dany", gender: "Male", company: "KFC" },
    { name: "Molly", gender: "Female", company: "Burger King" }
  ];
  columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];
  constructor() {}

  ngOnInit(): void {}
}
