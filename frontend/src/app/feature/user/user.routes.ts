import { Routes } from '@angular/router';
import { AuthGuard } from '../../@core/guards';
import { LayoutComponent } from '../../@core/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

export default [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',

                component: HomeComponent,
            },
            {
                path: 'profile',

                component: ProfileComponent,
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: 'signup',
        component: RegisterComponent,
    },
] as Routes;
