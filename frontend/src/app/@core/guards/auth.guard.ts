import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
    });
    return false;
};
