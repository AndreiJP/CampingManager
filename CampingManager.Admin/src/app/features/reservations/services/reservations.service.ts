import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../shared/models/paged-result';
import { Reservation, ReservationStatus, SaveReservationRequest } from '../models/reservation.model';

export interface ReservationQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: ReservationStatus;
  fromDate?: string;
  toDate?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly resourceUrl = `${environment.apiBaseUrl}/Reservations`;

  constructor(private readonly http: HttpClient) {}

  getReservations(query: ReservationQuery): Observable<PagedResult<Reservation>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    if (query.fromDate) {
      params = params.set('fromDate', query.fromDate);
    }

    if (query.toDate) {
      params = params.set('toDate', query.toDate);
    }

    return this.http.get<PagedResult<Reservation>>(this.resourceUrl, { params });
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
}
