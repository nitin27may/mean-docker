import { Routes } from '@angular/router';
import { authGuard } from '../../@core/guards';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsResolver } from './contact.resolver';
import { LayoutComponent } from "../../@core/layout/layout.component";
export default [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ContactListComponent,
            },
            {
                path: 'create',
                canActivate: [authGuard],
                component: ContactFormComponent,
            },
            {
                path: 'edit/:contactId',
                canActivate: [authGuard],
                component: ContactFormComponent,
                resolve: { contactDetails: ContactDetailsResolver },
            },
            {
                path: 'details/:contactId',
                component: ContactDetailsComponent,
                canActivate: [authGuard],
                resolve: { contactDetails: ContactDetailsResolver },
            },
        ],
    },
] as Routes;
