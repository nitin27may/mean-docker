/**
 * Mirrors IContact in api/src/models/contact.ts. workPhone was declared here
 * but exists nowhere in the API; firstName, city, postalCode and create_date
 * do exist and were missing, which is why callers fell back to `any`.
 */
export interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email?: string;
    city?: string;
    postalCode?: string;
    create_date?: string;
}

/** A contact that has not been saved yet, so the server has not assigned an id. */
export type NewContact = Omit<Contact, '_id'>;
