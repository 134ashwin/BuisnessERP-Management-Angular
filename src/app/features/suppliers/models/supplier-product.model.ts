/**
 * PURPOSE / PROBLEM SOLVED: Defines strong TypeScript interfaces for supplier products and form data to prevent type errors and guarantee data structure consistency.
 * NAVBAR PAGE & DATA DESTINATION: Represents data for the 'Suppliers' and 'Supplier Products' navbar pages (/dashboard/suppliers, /dashboard/supplier-products).
 */

export interface SupplierProductFormData {
  Sku: string;
  mainSku: string;
  description?: string;
  IsActive: boolean;
  SubSkuCode?: string;
  Qty?: string;
  ImageUrl?: string;
  supplierName: string;
  GSTNumber: string;
  locationCode: string;
  status : boolean;
}

export interface SupplierProduct extends SupplierProductFormData {
  id: string | number;
  createdAt: string;
  itemCount?: number;
}

export interface SupplierInfo {
  id: string;
  name: string;
  GstNumber : string;
  code: string;
  location: string;
  category: string;
  status: 'Active' | 'Inactive';
  totalProducts: number;
}

export interface Supplier_Minor_Details
{
  name: string;
  gstNumber : string;
}
