import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactService } from "../contact.service";

@Component({
    selector: 'app-contact-details',
    imports: [RouterModule, CommonModule, ReactiveFormsModule],
    templateUrl: './contact-details.component.html',
    styleUrl: './contact-details.component.css',
    providers: [ContactService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailsComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    contact: any;

    edit(): void {
        this.router.navigate(['/contacts/edit/' + this.contact._id]);
    }

    ngOnInit(): void {
        this.contact = this.activatedRoute.snapshot.data.contactDetails;
    }
}
