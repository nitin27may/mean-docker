import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactService } from "../contact.service";

import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-contact-details',
    standalone: true,
    imports: [RouterModule, CommonModule, ReactiveFormsModule],
    templateUrl: './contact-details.component.html',
    styleUrl: './contact-details.component.css',
    providers: [ContactService],
})
export class ContactDetailsComponent implements OnInit {
    contact: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    edit(): void {
        this.router.navigate(['/contacts/edit/' + this.contact._id]);
    }
    ngOnInit(): void {
        this.contact = this.activatedRoute.snapshot.data.contactDetails;
    }
}
