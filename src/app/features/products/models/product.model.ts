import { SubSkuDetail } from './SubSkuDetail.model';

export type ProductStatus = 'Active' | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued' | 'Inactive';

/**
 * Product Model (Root Entity)
 * 
 * NORMALIZED ARCHITECTURE:
 * Supplier and Location are lifted to this root entity to eliminate duplication
 * across SubSku instances (3NF Normalization).
 * 
 * Required Fields:
 * - Date_d_m_y: Date string formatted as d/m/y (e.g. '26/09/2026')
 * - mainSku: Primary master SKU
 * - SubSku: Child variants encapsulated in subSkus array
 * - Supplier: Master supplier / vendor lifted to root
 * - Size: Specific size dimension stored per SubSku variant
 * - Location: Storage / warehouse facility location lifted to root
 * - Description: Product overview and catalog description
 * - Status: Inventory and lifecycle status
 */
export interface Product {
  id: number;
  mainSku: string;                 // Required: Master SKU (mainSku)
  supplier: string;                // Required: Master Supplier (lifted to root)
  location: string;                // Required: Primary Location (lifted to root)
  description: string;             // Required: Product Description
  status: ProductStatus | string;  // Required: Product Status
  Date_d_m_y: string;              // Required: Date formatted as d/m/y
  subSkus: SubSkuDetail[];         // Required: SubSku variants
  sku?: string;                    // Backward compatibility alias for mainSku
  isExpanded?: boolean;            // UI state flag for expandable detail rows

  // Resilient casing aliases#
  qty?: string;
  Supplier?: string;
  Location?: string;
  Description?: string;
  Status?: string;
  date_d_m_y?: string;
}

/**
 * Normalization Utility
 * Ensures incoming raw/legacy API payloads are cleanly mapped to the normalized Product model,
 * lifting Supplier and Location to root and ensuring all 8 required fields are safely populated.
 */
export function normalizeProduct(raw: any): Product {
  // Extract first sub-SKU as fallback if root fields are missing
  const firstSub = raw.subSkus?.[0] || raw.SubSkus?.[0] || {};

  return {
    id: raw.id ?? raw.Id ?? 0,
    sku: raw.sku ?? raw.Sku ?? '',
    mainSku: raw.mainSku ?? raw.MainSku ?? '',

    // 🔴 FIX 1: Add missing required interface properties
    description: raw.description ?? raw.Description ?? '',
    status: raw.status ?? raw.Status ?? 'Active',
    Date_d_m_y: raw.Date_d_m_y ?? raw.createdDate ?? raw.CreatedDate ?? 'N/A',

    // Maps supplier and location flexibly from root or first sub-SKU
    supplier: raw.supplierName
      ?? raw.SupplierName
      ?? raw.supplier
      ?? firstSub.supplierName
      ?? firstSub.SupplierName
      ?? 'N/A',

    location: raw.location
      ?? raw.Location
      ?? firstSub.location
      ?? firstSub.Location
      ?? 'N/A',

    date_d_m_y: raw.createdDate
      ?? raw.CreatedDate
      ?? raw.Date_d_m_y
      ?? firstSub.createdDate
      ?? 'N/A',

    subSkus: Array.isArray(raw.subSkus || raw.SubSkus)
      ? (raw.subSkus || raw.SubSkus).map((s: any) => ({
        id: s.id ?? s.Id ?? 0,
        subSku: s.subSku ?? s.SubSku ?? s.subSkuCode ?? '',
        qty: s.qty ?? s.Qty ?? 0,
        imageUrl: s.imageUrl ?? s.ImageUrl ?? '',
        supplierName: s.supplierName ?? s.SupplierName ?? 'N/A',
        location: s.location ?? s.Location ?? 'N/A',
        createdDate: s.createdDate ?? s.CreatedDate ?? 'N/A'
      }))
      : []
  };
}