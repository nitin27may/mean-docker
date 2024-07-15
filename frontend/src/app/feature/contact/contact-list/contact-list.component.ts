import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from '../contact.service';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    imports: [
        RouterModule,
        DecimalPipe,
        AsyncPipe,
        FormsModule,
        ReactiveFormsModule,
        NgbHighlight,
        NgbPaginationModule,
    ],
    templateUrl: './contact-list.component.html',
    styleUrl: './contact-list.component.css',
    providers: [DecimalPipe, ContactService],
})
export class ContactListComponent implements OnInit {
    contacts: any[];
    allContacts: any[];
    page = 1;
    pageSize = 4;
    collectionSize = 0;
    filter = new FormControl('', { nonNullable: true });

    constructor(
        private contactService: ContactService,
        private router: Router
    ) {}
    getAll(): void {
        this.contactService.getAll().subscribe(
            (data) => {
              data.sort((a, b) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime());
                console.log(data);
                this.collectionSize = data.length;
                this.allContacts = data;
                this.refreshContacts();
            },

            (error) => {}
        );
    }

    refreshContacts() {
        this.contacts = this.allContacts
            .map((contact, i) => ({ id: i + 1, ...contact }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            );
    }
    onSelect(selected: any): void {
        this.router.navigate(['/contacts/edit/' + selected._id]);
    }
    ngOnInit(): void {
        this.getAll();
    }
}
