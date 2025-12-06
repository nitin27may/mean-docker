import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../contact.service';

@Component({
    selector: 'app-contact-list',
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgbHighlight,
        NgbPaginationModule,
    ],
    templateUrl: './contact-list.component.html',
    styleUrl: './contact-list.component.css',
    providers: [ContactService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListComponent implements OnInit {
    private readonly contactService = inject(ContactService);
    private readonly router = inject(Router);
    private readonly modalService = inject(NgbModal);
    private readonly toastrService = inject(ToastrService);

    allContacts = signal<any[]>([]);
    page = signal(1);
    pageSize = signal(4);
    collectionSize = computed(() => this.allContacts().length);
    contacts = computed(() => {
        const start = (this.page() - 1) * this.pageSize();
        return this.allContacts()
            .map((contact, i) => ({ id: i + 1, ...contact }))
            .slice(start, start + this.pageSize());
    });

    filter = new FormControl('', { nonNullable: true });
    contactToDelete: any = null;

    getAll(): void {
        this.contactService.getAll().subscribe({
            next: (data) => {
                data.sort((a: any, b: any) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime());
                console.log(data);
                this.allContacts.set(data);
            },
            error: () => { }
        });
    }

    refreshContacts(): void {
        // Now handled by computed signal - just update page
        this.page.update(p => p);
    }

    onPageChange(newPage: number): void {
        this.page.set(newPage);
    }

    onPageSizeChange(newSize: number): void {
        this.pageSize.set(newSize);
    }

    onSelect(selected: any): void {
        this.router.navigate(['/contacts/details/' + selected._id]);
    }

    onEdit(event: Event, contact: any): void {
        event.stopPropagation();
        this.router.navigate(['/contacts/edit/' + contact._id]);
    }

    onDelete(event: Event, contact: any, modal: TemplateRef<any>): void {
        event.stopPropagation();
        this.contactToDelete = contact;
        this.modalService.open(modal, { centered: true });
    }

    confirmDelete(modal: any): void {
        if (this.contactToDelete) {
            this.contactService.delete(this.contactToDelete._id).subscribe({
                next: () => {
                    this.toastrService.success('Contact deleted successfully');
                    this.allContacts.update(contacts =>
                        contacts.filter(c => c._id !== this.contactToDelete._id)
                    );
                    this.contactToDelete = null;
                    modal.close();
                },
                error: () => {
                    this.toastrService.error('Failed to delete contact');
                    modal.close();
                }
            });
        }
    }

    ngOnInit(): void {
        this.getAll();
    }
}
