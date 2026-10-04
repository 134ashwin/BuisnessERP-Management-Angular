import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, normalizeProduct } from '../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  // Enterprise mock data conforming strictly to normalized architecture
  // Demonstrates: Supplier and Location lifted to root Product entity
  private readonly defaultProducts: Product[] = [
    //empty Array
  ];


  getProducts(searchQuery: string = ''): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl, {
      params: searchQuery ? { query: searchQuery } : {}
    }).pipe(
      map(data => {
        const list = Array.isArray(data) ? data : (data as any)?.items || [];
        return list.map(normalizeProduct);
      }),
      catchError(() => {
        // Fallback to normalized mock dataset during development/offline mode
        let result = this.defaultProducts;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          result = result.filter(p =>
            p.mainSku.toLowerCase().includes(q) ||
            p.supplier.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.status.toLowerCase().includes(q) ||
            p.Date_d_m_y.toLowerCase().includes(q) ||
            p.subSkus.some(s => s.subSku.toLocaleLowerCase(q).includes(q) || p.qty)
            // p.subSkus.some(s => s.subSku.toLowerCase().includes(q) || s.size.toLowerCase().includes(q))
          );
        }
        return of(result.map(normalizeProduct));
      })
    );
  }
}