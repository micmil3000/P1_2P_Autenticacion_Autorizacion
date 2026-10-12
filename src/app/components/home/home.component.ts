
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    protected readonly name = signal('');
    protected readonly role = signal('');
    protected readonly errorMessage = signal('');

    //Obtiene los datos del usuario autenticado al cargar el componente
    ngOnInit() {
        //Evita realizar la petición cuando Angular se ejecuta en el servidor
        if(!isPlatformBrowser(this.platformId)) {
            return;
        }

        //Consulta los datos del usuario autenticado desde el backend
        this.authService.getHome().subscribe({
            //En caso la petición sea correcta guarda el nombre y rol
            next: (response) => {
                this.name.set(response.name);
                this.role.set(response.role);
            },

            //En caso haya un error muestra un mensaje o redirige al usuario
            error: (error) => {
                if(error.status === 401) {
                    this.logout();
                } else if(error.status === 403) {
                    this.router.navigate(['/no-access']);
                } else {
                    this.errorMessage.set('Ocurrió un error al obtener tus datos.');
                }
            }
        });
    }

    //Cierra la sesión y redirige al login
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
