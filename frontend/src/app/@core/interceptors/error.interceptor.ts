import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((errorResponse) => {
            let errorMessage = 'An unexpected error occurred';

            if (errorResponse instanceof HttpErrorResponse) {
                // Try to extract server message from various possible structures
                const error = errorResponse.error;
                let serverMessage: string | undefined;

                // Handle different error response structures
                if (typeof error === 'string') {
                    serverMessage = error;
                } else if (error?.message && typeof error.message === 'string') {
                    serverMessage = error.message;
                } else if (error?.error?.message && typeof error.error.message === 'string') {
                    serverMessage = error.error.message;
                }

                if (serverMessage) {
                    errorMessage = serverMessage;
                } else {
                    // Fallback to default messages based on status code
                    switch (errorResponse.status) {
                        case 0:
                            errorMessage = 'Unable to connect to server. Please check your internet connection.';
                            break;
                        case 400:
                            errorMessage = 'Bad request. Please check your input.';
                            break;
                        case 401:
                            errorMessage = 'Invalid credentials. Please try again.';
                            break;
                        case 403:
                            errorMessage = 'Access denied. You do not have permission.';
                            break;
                        case 404:
                            errorMessage = 'Resource not found.';
                            break;
                        case 405:
                            errorMessage = 'Method not allowed.';
                            break;
                        case 408:
                            errorMessage = 'Request timeout. Please try again.';
                            break;
                        case 409:
                            errorMessage = 'Conflict. The resource already exists.';
                            break;
                        case 422:
                            errorMessage = 'Validation error. Please check your input.';
                            break;
                        case 429:
                            errorMessage = 'Too many requests. Please wait and try again.';
                            break;
                        case 500:
                            errorMessage = 'Internal server error. Please try again later.';
                            break;
                        case 502:
                            errorMessage = 'Bad gateway. Server is temporarily unavailable.';
                            break;
                        case 503:
                            errorMessage = 'Service unavailable. Please try again later.';
                            break;
                        case 504:
                            errorMessage = 'Gateway timeout. Please try again later.';
                            break;
                        default:
                            errorMessage = errorResponse.statusText || 'An unexpected error occurred';
                    }
                }
            }

            return throwError(() => errorMessage);
        })
    );
};
