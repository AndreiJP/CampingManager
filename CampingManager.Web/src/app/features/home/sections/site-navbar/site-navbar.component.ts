import { Component } from '@angular/core';

interface SiteNavigationItem {
  label: string;
  href: string;
}

@Component({
  selector: 'app-site-navbar',
  standalone: false,
  templateUrl: './site-navbar.component.html',
  styleUrl: './site-navbar.component.scss',
})
export class SiteNavbarComponent {
  readonly navigationItems: SiteNavigationItem[] = [
    { label: 'Home', href: '#top' },
  ];
}
