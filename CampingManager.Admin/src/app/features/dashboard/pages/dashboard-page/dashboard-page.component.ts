import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  readonly cards = [
    {
      title: 'Prenotazioni',
      text: 'Controlla disponibilita, stati e soggiorni.',
      icon: 'bi-calendar-check',
      route: '/reservations',
    },
    {
      title: 'Clienti',
      text: 'Consulta e gestisci l anagrafica clienti.',
      icon: 'bi-people',
      route: '/customers',
    },
    {
      title: 'Piazzole',
      text: 'Mantieni aggiornato il catalogo piazzole.',
      icon: 'bi-grid-3x3-gap',
      route: '/pitches',
    },
    {
      title: 'Attrezzature',
      text: 'Gestisci tende, camper, roulotte e opzioni.',
      icon: 'bi-truck',
      route: '/equipment-types',
    },
  ];
}
