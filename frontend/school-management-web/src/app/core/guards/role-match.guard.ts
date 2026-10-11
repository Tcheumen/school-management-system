import {
    inject
} from '@angular/core';

import {
    CanMatchFn,
    Router
} from '@angular/router';

import {
    AuthService
} from '../services/auth.service';


export const roleMatchGuard: CanMatchFn = (
    route
) => {

    const authService =
        inject(AuthService);

    const router =
        inject(Router);

    const token =
        authService.getToken();

    const role =
        authService.getRole();

    const allowedRoles =
        route.data?.['roles'] as string[] | undefined;


    if (!token) {

        return router.createUrlTree([
            '/login'
        ]);
    }


    if (
        allowedRoles?.includes(role ?? '')
    ) {

        return true;
    }


    /*
     * IMPORTANT :
     * false permet au Router de tester
     * le prochain path: ''
     */
    return false;
};