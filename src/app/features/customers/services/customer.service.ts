import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer, CustomerOrderResponseDto, CreateCustomerRequestDto } from '../models/customer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  // Endpoint for customers: /api/Customer
  private apiUrl = `${environment.apiUrl}/Customer`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<CustomerOrderResponseDto[]>(this.apiUrl).pipe(
      map((items) =>
        (items || []).map((dto) => {
          // .NET backend returns property 'Customer' (camelCase: 'customer') in CustomerOrderResponseDto
          const customerName = dto.customer || (dto as any).Customer || (dto as any).customerName || '';
          return {
            id: dto.id,
            orderNo: dto.orderNo || '',
            mainSku: dto.mainSku || '',
            subSku: dto.subSku ?? '',
            size: dto.size ?? '',
            customer: customerName,
            customerName: customerName,
            description: dto.description ?? '',
            createdAt: dto.createdAt
          };
        })
      )
    );
  }

  createCustomer(payload: CreateCustomerRequestDto): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
