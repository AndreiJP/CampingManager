import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { buildHttpParams } from '../../../core/http/api-params';
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
    const params = buildHttpParams(query);

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
