import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { buildHttpParams } from '../../../core/http/api-params';
import { PagedResult } from '../../../shared/models/paged-result';
import { Customer, SaveCustomerRequest } from '../models/customer.model';

export interface CustomerQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly resourceUrl = `${environment.apiBaseUrl}/Customers`;

  constructor(private readonly http: HttpClient) {}

  getCustomers(query: CustomerQuery): Observable<PagedResult<Customer>> {
    const params = buildHttpParams(query);

    return this.http.get<PagedResult<Customer>>(this.resourceUrl, { params });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.resourceUrl}/${id}`);
  }

  createCustomer(request: SaveCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.resourceUrl, request);
  }

  updateCustomer(id: number, request: SaveCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.resourceUrl}/${id}`, request);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
