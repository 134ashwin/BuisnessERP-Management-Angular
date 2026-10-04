import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer, CustomerFormData } from '../models/customer.model';
import { environment } from '../../../../environments/environment';
import { CreateCustomerRequestDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  // Assuming the endpoint for customers is /api/Customers
  private apiUrl = `${environment.apiUrl}/Customer`;

  getCustomers(): Observable<Customer[]> {
    // If backend doesn't exist yet, we could return a mock array or just make the call and handle error
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(payload: CreateCustomerRequestDto): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
