import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../shared/models/paged-result';
import { EquipmentType, SaveEquipmentTypeRequest } from '../models/equipment-type.model';

export interface EquipmentTypeQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class EquipmentTypesService {
  private readonly resourceUrl = `${environment.apiBaseUrl}/CampingEquipmentTypes`;

  constructor(private readonly http: HttpClient) {}

  getEquipmentTypes(query: EquipmentTypeQuery): Observable<PagedResult<EquipmentType>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.isActive !== undefined) {
      params = params.set('isActive', query.isActive);
    }

    return this.http.get<PagedResult<EquipmentType>>(this.resourceUrl, { params });
  }

  getEquipmentType(id: number): Observable<EquipmentType> {
    return this.http.get<EquipmentType>(`${this.resourceUrl}/${id}`);
  }

  createEquipmentType(request: SaveEquipmentTypeRequest): Observable<EquipmentType> {
    return this.http.post<EquipmentType>(this.resourceUrl, request);
  }

  updateEquipmentType(id: number, request: SaveEquipmentTypeRequest): Observable<EquipmentType> {
    return this.http.put<EquipmentType>(`${this.resourceUrl}/${id}`, request);
  }

  deleteEquipmentType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
