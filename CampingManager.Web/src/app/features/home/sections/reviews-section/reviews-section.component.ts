import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Review {
  authorName: string;
  authorPhotoUrl: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
}

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionComponent {
  // In the future, this can be fetched from an API (e.g., Google Places API)
  readonly reviews: Review[] = [
    {
      authorName: 'Marco Rossi',
      authorPhotoUrl: 'https://i.pravatar.cc/150?u=marco',
      rating: 5,
      relativeTimeDescription: '2 settimane fa',
      text: 'Posto incantevole, immerso nel verde e molto curato. Il personale è gentilissimo e le piazzole sono ampie e ben ombreggiate. Torneremo sicuramente!',
    },
    {
      authorName: 'Giulia Bianchi',
      authorPhotoUrl: 'https://i.pravatar.cc/150?u=giulia',
      rating: 4,
      relativeTimeDescription: '1 mese fa',
      text: 'Ottima esperienza in glamping. La tenda era pulitissima e dotata di ogni comfort. Unica nota: la connessione Wi-Fi potrebbe essere migliorata, ma forse è meglio così per staccare davvero!',
    },
    {
      authorName: 'Luca Verdi',
      authorPhotoUrl: 'https://i.pravatar.cc/150?u=luca',
      rating: 5,
      relativeTimeDescription: '3 mesi fa',
      text: 'Il miglior campeggio della zona per chi ama la tranquillità. Le escursioni organizzate sono fantastiche e il ristorante interno offre piatti locali deliziosi.',
    },
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}
