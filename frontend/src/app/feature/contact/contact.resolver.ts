import { inject } from '@angular/core';
import { ContactService } from "./contact.service";
import { ResolveFn } from '@angular/router';
import { Contact } from './contact.interface';
import { of } from 'rxjs';

export const ContactDetailsResolver: ResolveFn<Contact | null> = (route) => {
  const contactService = inject(ContactService);
  const contactId = route.paramMap.get('contactId');

  return contactId ? contactService.getById(contactId) : of(null);
};
