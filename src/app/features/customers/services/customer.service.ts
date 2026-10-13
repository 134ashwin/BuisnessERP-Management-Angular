import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer, CustomerResponseDto, CustomerCreateDto } from '../models/customer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  // Primary endpoint: /api/customers
  private apiUrl = `${environment.apiUrl}/customers`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<CustomerResponseDto[]>(this.apiUrl).pipe(
      map((items) =>
        (items || []).map((dto) => this.mapDtoToCustomer(dto))
      )
    );
  }

  getB2BCustomers(): Observable<Customer[]> {
    return this.http.get<CustomerResponseDto[]>(`${this.apiUrl}/b2b`).pipe(
      map((items) =>
        (items || []).map((dto) => this.mapDtoToCustomer(dto))
      )
    );
  }

  getB2CCustomers(): Observable<Customer[]> {
    return this.http.get<CustomerResponseDto[]>(`${this.apiUrl}/b2c`).pipe(
      map((items) =>
        (items || []).map((dto) => this.mapDtoToCustomer(dto))
      )
    );
  }

  createCustomer(payload: CustomerCreateDto): Observable<CustomerResponseDto> {
    return this.http.post<CustomerResponseDto>(this.apiUrl, payload);
  }

  getCustomerById(id: number): Observable<CustomerResponseDto> {
    return this.http.get<CustomerResponseDto>(`${this.apiUrl}/${id}`);
  }

  private mapDtoToCustomer(dto: CustomerResponseDto): Customer {
    console.log('API Response:', dto);
    const rawGst = dto.gstNumber;
    const formattedGst = (!rawGst || rawGst.trim() === '' || rawGst.toLowerCase() === 'no gst number')
      ? 'No GST Number'
      : rawGst;

    return {
      id: dto.id,
      name: dto.name,
      customerName: dto.name,
      mobileNumber: dto.mobileNumber,
      email: dto.email ?? null,
      gstNumber: formattedGst,
      address:dto.address ?? 'No Addresss Provided',
      description:dto.description,
      isB2B: dto.isB2B ?? (formattedGst !== 'No GST Number')
    };
  }
}
