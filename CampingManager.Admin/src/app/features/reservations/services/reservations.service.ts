import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { buildHttpParams } from '../../../core/http/api-params';
import { PagedResult } from '../../../shared/models/paged-result';
import {
  PitchAvailability,
  Reservation,
  ReservationStatus,
  SaveReservationRequest,
} from '../models/reservation.model';

export interface ReservationQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: ReservationStatus;
  fromDate?: string;
  toDate?: string;
}

export interface AvailabilityQuery {
  fromDate: string;
  toDate: string;
  excludeReservationId?: number;
  includeUnavailable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly resourceUrl = `${environment.apiBaseUrl}/Reservations`;

  constructor(private readonly http: HttpClient) {}

  getReservations(query: ReservationQuery): Observable<PagedResult<Reservation>> {
    const params = buildHttpParams(query);

    return this.http.get<PagedResult<Reservation>>(this.resourceUrl, { params });
  }

  getAvailability(query: AvailabilityQuery): Observable<PitchAvailability[]> {
    const params = buildHttpParams(query);

    return this.http.get<PitchAvailability[]>(`${this.resourceUrl}/availability`, { params });
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.resourceUrl}/${id}`);
  }

  createReservation(request: SaveReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.resourceUrl, request);
  }

  updateReservation(id: number, request: SaveReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.resourceUrl}/${id}`, request);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }

  confirmReservation(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.resourceUrl}/${id}/confirm`, {});
  }

  checkInReservation(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.resourceUrl}/${id}/check-in`, {});
  }

  checkOutReservation(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.resourceUrl}/${id}/check-out`, {});
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.resourceUrl}/${id}/cancel`, {});
  }
}
