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
      Sku: 'SKU-8820',
      mainSku: 'MSKU-8820',
      SubSkuCode: '',
      Qty: '',
      locationCode: 'Warehouse A · Bay 14',
      IsActive: true,
      ImageUrl: '',
      GSTNumber: '29ABCDE1234F1Z5',
      description: 'Thermal-Insulated Industrial High-Visibility Workwear Jacket with heavy-duty weatherproofing.',
      status:true,
      createdAt: '2026-09-24T10:00:00Z',
      itemCount: 450
    }
  ]);

  /**
   * Primary action handler required by specification:
   * Ready to connect to backend API endpoint (e.g. POST /api/products)
   */
  handleCreateProduct(formData: any): Observable<SupplierProduct> {
    const payload: SupplierProductFormData = {
      Sku: formData?.sku?.trim() || '',
      mainSku: formData?.mainSku?.toUpperCase().trim() || '',
      description: formData?.description?.trim() || '',
      IsActive: formData?.isActive ?? true,
      SubSkuCode: formData?.subSkuCode?.trim() || '',
      Qty: formData?.qty?.trim() || '',
      ImageUrl: formData?.imageUrl?.trim() || '',
      supplierName: formData?.supplierName?.trim() || '',
      GSTNumber: formData?.gstNumber?.trim() || '',
      locationCode: formData?.locationCode?.trim() || '',
      status:formData?.status
    };

    // console.log('2. Final API Payload:', payload);
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
    Sku: res?.Sku || fallbackData.Sku,
    mainSku: res?.MainSku || fallbackData.mainSku,
    description: res?.Description || fallbackData.description,
    IsActive: res?.IsActive ?? fallbackData.IsActive,
    SubSkuCode: res?.SubSkuCode || fallbackData.SubSkuCode,
    Qty: res?.Qty || fallbackData.Qty,
    ImageUrl: res?.ImageUrl || fallbackData.ImageUrl,
    supplierName: res?.SupplierName || fallbackData.supplierName,
    GSTNumber: res?.GSTNumber || fallbackData.GSTNumber,
    locationCode: res?.LocationCode || fallbackData.locationCode,
    status: res?.status ?? res?.IsActive ?? fallbackData.status ?? true,
    createdAt: res?.createdAt || new Date().toISOString(),
    itemCount: res?.itemCount || 0
  };
}
