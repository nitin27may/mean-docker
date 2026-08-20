import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../@core/services/notification.service';
import { Contact } from '../contact.interface';
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
    private readonly notificationService = inject(NotificationService);

    allContacts = signal<Contact[]>([]);
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
    contactToDelete: Contact | null = null;

    getAll(): void {
        this.contactService.getAll().subscribe({
            next: (data) => {
                data.sort((a, b) => new Date(b.create_date ?? 0).getTime() - new Date(a.create_date ?? 0).getTime());
                this.allContacts.set(data);
            },
            error: () => {
                this.notificationService.error('Failed to load contacts');
            }
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

    onSelect(selected: Contact): void {
        this.router.navigate(['/contacts/details/' + selected._id]);
    }

    onEdit(event: Event, contact: Contact): void {
        event.stopPropagation();
        this.router.navigate(['/contacts/edit/' + contact._id]);
    }

    onDelete(event: Event, contact: Contact, modal: TemplateRef<unknown>): void {
        event.stopPropagation();
        this.contactToDelete = contact;
        this.modalService.open(modal, { centered: true });
    }

    confirmDelete(modal: { close: () => void }): void {
        const contactToDelete = this.contactToDelete;

        if (contactToDelete) {
            this.contactService.delete(contactToDelete._id).subscribe({
                next: () => {
                    this.notificationService.success('Contact deleted successfully');
                    this.allContacts.update(contacts =>
                        contacts.filter(c => c._id !== contactToDelete._id)
                    );
                    this.contactToDelete = null;
                    modal.close();
                },
                error: () => {
                    this.notificationService.error('Failed to delete contact');
                    modal.close();
                }
            });
        }
    }

    ngOnInit(): void {
        this.getAll();
    }
}
