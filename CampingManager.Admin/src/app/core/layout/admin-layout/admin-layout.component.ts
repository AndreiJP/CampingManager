import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.getCurrentUser();
  readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
    { label: 'Prenotazioni', icon: 'bi-calendar-check', route: '/reservations' },
    { label: 'Clienti', icon: 'bi-people', route: '/customers' },
    { label: 'Piazzole', icon: 'bi-grid-3x3-gap', route: '/pitches' },
    { label: 'Attrezzature', icon: 'bi-truck', route: '/equipment-types' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
