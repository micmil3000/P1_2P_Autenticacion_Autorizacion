import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { HomeComponent } from './components/home/home.component';
import { NoAccessComponent } from './components/no-access/no-access.component';

export const routes: Routes = [
    //ruta inicial
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    //ruta publica
    {
        path: 'login',
        component: LoginComponent
    },
    //ruta protegida
    {
        path: 'home',
        component: HomeComponent, 
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['ADMIN']
        }
    },
    //Ruta para usuarios sin permisos
    {
        path: 'no-access',
        component: NoAccessComponent,
        canActivate: [authGuard]
    }
];
