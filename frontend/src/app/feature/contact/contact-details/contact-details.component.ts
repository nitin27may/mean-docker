import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
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
    private readonly cdr = inject(ChangeDetectorRef);

    contact = signal<any>(null);

    edit(): void {
        const contactData = this.contact();
        if (contactData?._id) {
            this.router.navigate(['/contacts/edit', contactData._id]);
        }
    }

    ngOnInit(): void {
        const data = this.activatedRoute.snapshot.data['contactDetails'];
        this.contact.set(data);
        this.cdr.markForCheck();
    }
}
