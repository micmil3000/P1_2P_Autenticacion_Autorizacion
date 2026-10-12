import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    //Permitir el procesamiento de la ruta en el servidor
    if(!isPlatformBrowser(platformId)) {
        return true;
    }

    //Obtener roles permitidos en la ruta
    const rolesPermitidos: string[] = route.data['roles'] ?? [];

    //Verificar que exista una sesión
    if(!authService.isAuthenticated()) {
        return router.createUrlTree(['/login']);
    }

    //Verificar si el usuario tiene permisos
    if(authService.hasRole(rolesPermitidos)) {
        return true;
    }

    //Si está autenticado, pero no tiene permisos
    return router.createUrlTree(['/no-access']);
};