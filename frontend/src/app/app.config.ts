import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import {
    provideHttpClient,
    withInterceptors,
    withXhr,
} from '@angular/common/http';
import { provideErrorTailorConfig } from './@core/components/validation';
import { errorInterceptor } from './@core/interceptors/error.interceptor';
import { jwtInterceptor } from './@core/interceptors/jwtToken.Interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideAnimations(), // required animations providers
        provideErrorTailorConfig({
            errors: {
                useFactory() {
                    return {
                        required: 'This field is required',
                        minlength: ({ requiredLength, actualLength }) =>
                            `Expect ${requiredLength} but got ${actualLength}`,
                        invalidEmailAddress: (error) =>
                            `Email Address is not valid`,
                        invalidMobile: (error) => `Invalid Mobile number`,
                        invalidPassword: (error) => `Password is weak`,
                        passwordMustMatch: (error) =>
                            `Password is not matching`,
                    };
                },
                deps: [],
            },
            //controlErrorComponent: CustomControlErrorComponent, // Uncomment to see errors being rendered using a custom component
            //controlErrorComponentAnchorFn: controlErrorComponentAnchorFn // Uncomment to see errors being positioned differently
        }),
        provideHttpClient(
            withXhr(),
            withInterceptors([jwtInterceptor, errorInterceptor])
        ),
    ],
};
