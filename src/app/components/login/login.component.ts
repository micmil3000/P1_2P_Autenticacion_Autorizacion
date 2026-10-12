import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Credentials } from '../../models/credentials';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-login',
    styleUrl: './login.component.css',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly errorMessage = signal('');

    protected readonly form = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email]
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    login() {
        this.errorMessage.set('');

        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const credentials: Credentials = this.form.getRawValue();

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.authService.saveToken(response.token, response.role);
                this.router.navigate(['/home']);
            },
            error: (error) => {
                if(error.status === 401) {
                    this.errorMessage.set('Correo electrónico o contraseña incorrectos.');
                } else {
                    this.errorMessage.set('Ocurrió un error al iniciar sesión. Inténtalo nuevamente.');
                }
            }
        });
    }
}