import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-contact-details",
  templateUrl: "./contact-details.component.html",
  styleUrls: ["./contact-details.component.scss"]
})
export class ContactDetailsComponent implements OnInit {
  contact: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  edit(): void {
    this.router.navigate(["/contacts/edit/" + this.contact._id]);
  }
  ngOnInit(): void {
    this.contact = this.activatedRoute.snapshot.data.contactDetails;
  }
}
