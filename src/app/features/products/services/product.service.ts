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
    {
      id: 1,
      mainSku: 'MSKU-8820',
      sku: 'MSKU-8820',
      supplier: 'Apex Global Logistics',
      location: 'Warehouse A · Bay 14',
      description: 'Thermal-Insulated Industrial High-Visibility Workwear Jacket',
      status: 'In Stock',
      Date_d_m_y: '24/09/2026',
      isExpanded: false,
      subSkus: [
        {
          id: 101,
          subSku: 'SSKU-8820-S',
          size: 'Small (S)',
          qty: '1',
          description: 'Chest 36-38 in / Hi-Vis Yellow',
          status: 'In Stock',
          imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=150&auto=format&fit=crop&q=80',
          Date_d_m_y: '24/09/2026'
        },
        {
          id: 102,
          subSku: 'SSKU-8820-M',
          size: 'Medium (M)',
          qty: '1',
          description: 'Chest 39-41 in / Hi-Vis Yellow',
          status: 'In Stock',
          imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=150&auto=format&fit=crop&q=80',
          Date_d_m_y: '24/09/2026'
        },
        {
          id: 103,
          subSku: 'SSKU-8820-L',
          size: 'Large (L)',
          qty: '1',
          description: 'Chest 42-44 in / Hi-Vis Yellow',
          status: 'Low Stock',
          imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=150&auto=format&fit=crop&q=80',
          Date_d_m_y: '24/09/2026'
        },
      ]
    },
    {
      id: 2,
      mainSku: 'MSKU-4402',
      sku: 'MSKU-4402',
      supplier: 'Nordic Fabricators GmbH',
      location: 'Central Depot · Rack B-08',
      description: 'Precision Steel-Toe Anti-Static Safety Footwear',
      status: 'Active',
      Date_d_m_y: '22/09/2026',
      isExpanded: false,
      subSkus: [
        {
          id: 201,
          subSku: 'SSKU-4402-40',
          size: 'EU 40 / US 7.5',
          qty: '1',
          description: 'Oiled Nubuck Leather / Steel Cap',
          status: 'In Stock',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
          Date_d_m_y: '22/09/2026'
        },
      ]
    },
    {
      id: 3,
      mainSku: 'MSKU-9910',
      sku: 'MSKU-9910',
      supplier: 'Zenith Tech Hardware Ltd',
      location: 'Storage Bay 3 · Shelf E-02',
      description: 'Ergonomic Modular Sit-to-Stand Industrial Workbench Frame',
      status: 'Low Stock',
      Date_d_m_y: '18/09/2026',
      isExpanded: false,
      subSkus: [
        //empty subsku no data here
      ]
    },
    {
      id: 4,
      mainSku: 'MSKU-3105',
      sku: 'MSKU-3105',
      supplier: 'Solaria Optics Corp',
      location: 'Cleanroom Vault · Zone C-01',
      description: 'Scratch-Resistant Anti-Fog Polycarbonate Safety Goggles',
      status: 'In Stock',
      Date_d_m_y: '15/09/2026',
      isExpanded: false,
      subSkus: [
        {
          id: 401,
          subSku: 'SSKU-3105-STD',
          size: 'Standard Universal',
          qty: '1',
          description: 'Adjustable Silicone Headband / UV400',
          status: 'In Stock',
          imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&auto=format&fit=crop&q=80',
          Date_d_m_y: '15/09/2026'
        },
      ]
    },
    {
      id: 5,
      mainSku: 'MSKU-7240',
      sku: 'MSKU-7240',
      supplier: 'Titan Industrial Systems',
      location: 'West Hub · Bin W-33',
      description: 'Heavy-Duty Reinforced Kevlar Grip Handling Gloves',
      status: 'Active',
      Date_d_m_y: '10/09/2026',
      isExpanded: false,
      subSkus: [
      ]
    }
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