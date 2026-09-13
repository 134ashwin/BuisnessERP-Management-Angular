// Why it exists: Sends FormData containing the file stream over HTTP to the backend API.
// Ensures FormData key matches "file" precisely
// and this class lets HttpClient automatically handle content boundaries (never manually add Content-Type: multipart/form-data header in Angular).

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesOrder } from '../models/sales.model';


@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7098/api/sales';

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl);
  }

  importExcel(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ message: string }>(`${this.apiUrl}/import`, formData);
  }
}