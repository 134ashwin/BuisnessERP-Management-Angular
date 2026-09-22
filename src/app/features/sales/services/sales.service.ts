// Why it exists: Sends FormData containing the file stream over HTTP to the backend API.
// Ensures FormData key matches "file" precisely
// and this class lets HttpClient automatically handle content boundaries (never manually add Content-Type: multipart/form-data header in Angular).

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesOrder, PagedResult, SalesFilter } from '../models/sales.model';
import { environment } from '../../../../environments/environment'; // Import environment for baseUrl


@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // Single source of truth for API base URL

  getSalesOrders(filters: SalesFilter): Observable<PagedResult<SalesOrder>> {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.orderNo?.trim()) {
      params = params.set('orderNo', filters.orderNo.trim());
    }

    if (filters.date) {
      params = params.set('date', filters.date);
    }

    return this.http.get<PagedResult<SalesOrder>>(this.apiUrl, { params });
  }

  importExcel(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ message: string }>(`${this.apiUrl}/import`, formData);
  }
}