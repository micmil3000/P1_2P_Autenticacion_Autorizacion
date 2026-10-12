import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-no-access',
    imports: [],
    templateUrl: './no-access.component.html',
    styleUrl: './no-access.component.css'
})
export class NoAccessComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}