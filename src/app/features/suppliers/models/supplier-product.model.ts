/**
 * PURPOSE / PROBLEM SOLVED: Defines strong TypeScript interfaces for supplier products and form data to prevent type errors and guarantee data structure consistency.
 * NAVBAR PAGE & DATA DESTINATION: Represents data for the 'Suppliers' and 'Supplier Products' navbar pages (/dashboard/suppliers, /dashboard/supplier-products).
 */

export interface SupplierProductFormData {
  supplierName: string;
  mainSku: string;
  size?: string;
  location: string;
  status: 'Active' | 'Inactive';
  description?: string;
}

export interface SupplierProduct extends SupplierProductFormData {
  id: string | number;
  createdAt: string;
  itemCount?: number;
}

export interface SupplierInfo {
  id: string;
  name: string;
  code: string;
  location: string;
  category: string;
  status: 'Active' | 'Inactive';
  totalProducts: number;
}
