import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Credentials } from '../models/credentials';
import { ResponseLogin } from '../models/responseLogin';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private url = 'http://localhost:3000/api';

    constructor(
        private http : HttpClient, 
        private localStorageService : LocalStorageService
    ) {}
    //Enviar credenciales al backend
    login(user : Credentials): Observable<ResponseLogin> { 
        return this.http.post<ResponseLogin>(`${this.url}/login`, user);
    }

    saveToken(token : string, role : string) {
        this.localStorageService.setItem('token', token);
        this.localStorageService.setItem('role', role);
    }

    getToken() {
        return this.localStorageService.getItem('token');
    }

    isAuthenticated() {
        return this.getToken() !== null;
    }

    logout() {
        this.localStorageService.removeItem('token');
        this.localStorageService.removeItem('role');
    }

    getRole() {
        return this.localStorageService.getItem('role');
    }

    hasRole(rolesPermitidos : string[]) {
        const role = this.getRole();
        return role !== null && rolesPermitidos.includes(role);
    }

    //Obtiene los datos del usuario autenticado desde el backend
    getHome(): Observable<{ name: string; role: string }> {
        //Obtiene el JWT guardado en localStorage
        const token = this.getToken();

        //Crea el encabezado Authorization con el JWT
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        //Realiza la petición a la ruta protegida del backend
        return this.http.get<{ name: string; role: string }>(
            `${this.url}/home`,
            { headers }
        );
    }
}
