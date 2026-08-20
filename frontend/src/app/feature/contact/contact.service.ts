import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Contact, NewContact } from './contact.interface';

/** Every API route wraps its payload in this envelope. */
interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    private readonly http = inject(HttpClient);

    getAll() {
        return this.http.get<ApiResponse<Contact[]>>(environment.apiEndpoint + '/contacts').pipe(
            map((res) => res.data),
            catchError(this.handleErrorObservable)
        );
    }

    getById(_id: string) {
        return this.http.get<ApiResponse<Contact>>(environment.apiEndpoint + '/contact/' + _id).pipe(
            map((res) => res.data),
            catchError(this.handleErrorObservable)
        );
    }

    create(contact: NewContact) {
        return this.http
            .post<ApiResponse<Contact>>(environment.apiEndpoint + '/contacts', contact)
            .pipe(
                map((res) => res.data),
                catchError(this.handleErrorObservable)
            );
    }

    update(contact: Contact) {
        return this.http
            .put<ApiResponse<Contact>>(environment.apiEndpoint + '/contact/' + contact._id, contact)
            .pipe(
                map((res) => res.data),
                catchError(this.handleErrorObservable)
            );
    }

    delete(_id: string) {
        return this.http
            .delete<ApiResponse<Contact>>(environment.apiEndpoint + '/contact/' + _id)
            .pipe(
                map((res) => res.data),
                catchError(this.handleErrorObservable)
            );
    }
    private handleErrorObservable(error: HttpErrorResponse) {
        return throwError(() => error);
    }
}
