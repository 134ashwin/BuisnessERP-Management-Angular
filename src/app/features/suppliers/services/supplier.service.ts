import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupplierInfo, SupplierProduct } from '../models/supplier-product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private supplierUrl = `${environment.apiUrl}/suppliers`;
  // Used by ADD PRODUCT MODAL for the supplier dropdown list
  getSupplierNames(): Observable<string[]> {
    return this.http.get<any[]>(this.supplierUrl).pipe(
      map(suppliers => suppliers.map(s => s.name || s.supplierName))
    );
  }

  // Used by SUPPLIERS PAGE to get full supplier details
  getSuppliers(): Observable<SupplierInfo[]> {
    return this.http.get<SupplierInfo[]>(this.apiUrl);
  }

  // Used by SUPPLIERS PAGE to get all products
  getProducts(): Observable<SupplierProduct[]> {
    return this.http.get<SupplierProduct[]>('/api/products');
  }

  handleCreateProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }
}