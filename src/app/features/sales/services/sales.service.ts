import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SalesOrder, PagedResult, SalesFilter, SalesCustomer } from '../models/sales.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getB2BCustomers(): Observable<SalesCustomer[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customers/b2b`).pipe(
      map((items) => (items || []).map(item => this.normalizeCustomer(item)))
    );
  }

  getB2CCustomers(): Observable<SalesCustomer[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customers/b2c`).pipe(
      map((items) => (items || []).map(item => this.normalizeCustomer(item)))
    );
  }

  private normalizeCustomer(item: any): SalesCustomer {
    const rawGst = item.gstNumber ?? item.GstNumber;
    const formattedGst = (!rawGst || rawGst.trim() === '' || rawGst.toLowerCase() === 'no gst number')
      ? 'No GST Number'
      : rawGst;

    return {
      id: item.id ?? item.Id,
      name: item.name ?? item.Name ?? item.customerName ?? item.customer ?? '',
      customerName: item.name ?? item.Name ?? item.customerName ?? item.customer ?? '',
      mobileNumber: item.mobileNumber ?? item.MobileNumber ?? '',
      email: item.email ?? item.Email ?? null,
      gstNumber: formattedGst,
      isB2B: item.isB2B ?? (formattedGst !== 'No GST Number')
    };
  }

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

    return this.http.get<PagedResult<SalesOrder>>(`${this.apiUrl}/sales`, { params });
  }

  importExcel(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ message: string }>(`${this.apiUrl}/sales/import`, formData);
  }
}