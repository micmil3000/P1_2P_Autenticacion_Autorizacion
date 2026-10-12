import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    //Permitir que el servidor renderice la ruta
    if(!isPlatformBrowser(platformId)) {
        return true;
    }

    //Verificar si el usuario tiene una sesión
    if(authService.isAuthenticated()) {
        return true;
    }

    //Si no está autenticado, enviarlo a Login
    return router.createUrlTree(['/login']);
};