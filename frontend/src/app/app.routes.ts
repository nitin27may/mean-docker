import { Routes } from '@angular/router';
import { AuthGuard } from "./@core/guards";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('app/feature/user/user.routes'),
            },
        ],
    },
    {
        path: 'contacts',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('app/feature/contact/contact.routes'),
            },
        ],
    },
];
