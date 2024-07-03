import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // extract error message from http body if an error occurs
        return next.handle(request).pipe(
            catchError((errorResponse) => {
                if (errorResponse instanceof HttpErrorResponse) {
                    switch (errorResponse.status) {
                        case 401: // login
                            // redirect to login page
                            break;
                        case 400: // forbidden
                            // show server bad request message
                            // this.toastrService.error(errorResponse.error?.message);
                            break;
                    }
                } else {
                }

                return throwError(errorResponse.error);
            })
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};
