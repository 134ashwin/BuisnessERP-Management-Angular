/**
 * PURPOSE / PROBLEM SOLVED: Manages supplier product state and handles backend API calls (POST /api/products) with mock fallbacks for seamless product creation.
 * NAVBAR PAGE & DATA DESTINATION: Supplies live state and handles creation requests for the 'Suppliers' and 'Supplier Products' navbar pages.
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError, map } from 'rxjs/operators';
import { SupplierProduct, SupplierProductFormData, SupplierInfo } from '../models/supplier-product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  // Reactive state using Angular Signals
  readonly suppliers = signal<SupplierInfo[]>([
    { id: 'sup-01', name: 'Apex Global Logistics', code: 'APX-LOG', location: 'Warehouse A · Bay 14', category: 'Workwear & Gear', status: 'Active', totalProducts: 142 },
    { id: 'sup-02', name: 'Nordic Fabricators GmbH', code: 'NRD-FAB', location: 'Central Depot · Rack B-08', category: 'Safety Footwear', status: 'Active', totalProducts: 89 },
    { id: 'sup-03', name: 'Zenith Tech Hardware Ltd', code: 'ZNT-HWD', location: 'Storage Bay 3 · Shelf E-02', category: 'Industrial Equipment', status: 'Active', totalProducts: 64 },
    { id: 'sup-04', name: 'Solaria Optics Corp', code: 'SLR-OPT', location: 'Cleanroom Vault · Zone C-01', category: 'Eyewear & PPE', status: 'Active', totalProducts: 38 },
    { id: 'sup-05', name: 'Titan Industrial Systems', code: 'TTN-IND', location: 'West Hub · Bin W-33', category: 'Hand Protection', status: 'Inactive', totalProducts: 21 }
  ]);

  readonly products = signal<SupplierProduct[]>([
    {
      id: 'PRD-1001',
      supplierName: 'Apex Global Logistics',
      mainSku: 'MSKU-8820',
      size: 'Standard Variant (S-XL)',
      location: 'Warehouse A · Bay 14',
      status: 'Active',
      description: 'Thermal-Insulated Industrial High-Visibility Workwear Jacket with heavy-duty weatherproofing.',
      createdAt: '2026-09-24T10:00:00Z',
      itemCount: 450
    },
    {
      id: 'PRD-1002',
      supplierName: 'Nordic Fabricators GmbH',
      mainSku: 'MSKU-4402',
      size: 'EU 40 - EU 44',
      location: 'Central Depot · Rack B-08',
      status: 'Active',
      description: 'Precision Steel-Toe Anti-Static Safety Footwear for hazardous environments.',
      createdAt: '2026-09-22T14:30:00Z',
      itemCount: 280
    },
    {
      id: 'PRD-1003',
      supplierName: 'Zenith Tech Hardware Ltd',
      mainSku: 'MSKU-9910',
      size: '120cm x 80cm',
      location: 'Storage Bay 3 · Shelf E-02',
      status: 'Active',
      description: 'Ergonomic Modular Sit-to-Stand Industrial Workbench Frame with dual motor drive.',
      createdAt: '2026-09-18T11:15:00Z',
      itemCount: 95
    },
    {
      id: 'PRD-1004',
      supplierName: 'Solaria Optics Corp',
      mainSku: 'MSKU-3105',
      size: 'Universal Standard',
      location: 'Cleanroom Vault · Zone C-01',
      status: 'Active',
      description: 'Scratch-Resistant Anti-Fog Polycarbonate Safety Goggles with silicone headband.',
      createdAt: '2026-09-15T09:45:00Z',
      itemCount: 620
    },
    {
      id: 'PRD-1005',
      supplierName: 'Titan Industrial Systems',
      mainSku: 'MSKU-7240',
      size: 'Size 8 - Size 10',
      location: 'West Hub · Bin W-33',
      status: 'Inactive',
      description: 'Heavy-Duty Reinforced Kevlar Grip Handling Gloves for high cut resistance.',
      createdAt: '2026-09-10T16:20:00Z',
      itemCount: 150
    }
  ]);

  /**
   * Primary action handler required by specification:
   * Ready to connect to backend API endpoint (e.g. POST /api/products)
   */
  handleCreateProduct(formData: SupplierProductFormData): Observable<SupplierProduct> {
    const payload = {
      ...formData,
      mainSku: formData.mainSku.toUpperCase().trim(),
      supplierName: formData.supplierName.trim(),
      location: formData.location.trim(),
      description: formData.description?.trim() || ''
    };

    return this.http.post<SupplierProduct>(this.apiUrl, payload).pipe(
      map(res => normalizeCreatedProduct(res, payload)),
      catchError(() => {
        const createdProduct: SupplierProduct = {
          id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
          ...payload,
          createdAt: new Date().toISOString(),
          itemCount: 0
        };

        return of(createdProduct).pipe(delay(700));
      }),
      tap(newProduct => {
        this.products.update(list => [newProduct, ...list]);
      })
    );
  }

  getSuppliers(): SupplierInfo[] {
    return this.suppliers();
  }

  getProducts(): SupplierProduct[] {
    return this.products();
  }
}

function normalizeCreatedProduct(res: any, fallbackData: SupplierProductFormData): SupplierProduct {
  return {
    id: res?.id || res?.sku || `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
    supplierName: res?.supplierName || res?.supplier || fallbackData.supplierName,
    mainSku: res?.mainSku || res?.sku || fallbackData.mainSku,
    size: res?.size || fallbackData.size,
    location: res?.location || fallbackData.location,
    status: res?.status || fallbackData.status,
    description: res?.description || fallbackData.description,
    createdAt: res?.createdAt || new Date().toISOString(),
    itemCount: res?.itemCount || 0
  };
}
