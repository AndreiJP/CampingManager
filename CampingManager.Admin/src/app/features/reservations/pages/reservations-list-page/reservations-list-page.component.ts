import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { PagedResult } from '../../../../shared/models/paged-result';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservations-list-page',
  standalone: false,
  templateUrl: './reservations-list-page.component.html',
})
export class ReservationsListPageComponent implements OnInit {
  result: PagedResult<Reservation> | null = null;
  search = '';
  status = '';
  fromDate = '';
  toDate = '';
  isLoading = false;
  errorMessage = '';
  readonly pageSize = 20;
  readonly statuses: ReservationStatus[] = ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'NoShow'];

  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(pageNumber = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reservationsService
      .getReservations({
        pageNumber,
        pageSize: this.pageSize,
        search: this.search.trim() || undefined,
        status: this.status ? (this.status as ReservationStatus) : undefined,
        fromDate: this.fromDate || undefined,
        toDate: this.toDate || undefined,
      })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          this.result = result;
        },
        error: () => {
          this.errorMessage = 'Impossibile caricare le prenotazioni. Verifica che API e login siano attivi.';
        },
      });
  }

  statusClass(status: ReservationStatus): string {
    const classes: Record<ReservationStatus, string> = {
      Pending: 'text-bg-warning',
      Confirmed: 'text-bg-primary',
      CheckedIn: 'text-bg-success',
      CheckedOut: 'text-bg-secondary',
      Cancelled: 'text-bg-danger',
      NoShow: 'text-bg-dark',
    };

    return classes[status];
  }

  deleteReservation(reservation: Reservation): void {
    const confirmed = window.confirm(`Eliminare la prenotazione ${reservation.reservationCode}?`);

    if (!confirmed) {
      return;
    }

    this.reservationsService.deleteReservation(reservation.id).subscribe({
      next: () => this.loadReservations(this.result?.pageNumber ?? 1),
      error: () => {
        this.errorMessage = 'Impossibile eliminare la prenotazione.';
        this.changeDetector.markForCheck();
      },
    });
  }
}
