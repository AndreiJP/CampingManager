import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../shared/models/paged-result';
import { Pitch, SavePitchRequest } from '../models/pitch.model';

export interface PitchQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PitchesService {
  private readonly resourceUrl = `${environment.apiBaseUrl}/Pitches`;

  constructor(private readonly http: HttpClient) {}

  getPitches(query: PitchQuery): Observable<PagedResult<Pitch>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.isActive !== undefined) {
      params = params.set('isActive', query.isActive);
    }

    return this.http.get<PagedResult<Pitch>>(this.resourceUrl, { params });
  }

  getPitch(id: number): Observable<Pitch> {
    return this.http.get<Pitch>(`${this.resourceUrl}/${id}`);
  }

  createPitch(request: SavePitchRequest): Observable<Pitch> {
    return this.http.post<Pitch>(this.resourceUrl, request);
  }

  updatePitch(id: number, request: SavePitchRequest): Observable<Pitch> {
    return this.http.put<Pitch>(`${this.resourceUrl}/${id}`, request);
  }

  deletePitch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
