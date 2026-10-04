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
  createdDate: string;
}

/**
 * Normalization Utility
 * Ensures incoming raw/legacy API payloads are cleanly mapped to the normalized Product model,
 * lifting Supplier and Location to root and ensuring all 8 required fields are safely populated.
 */
export function normalizeProduct(raw: any): Product {
  // If the API returned HTML or non-object data, handle safely
  if (!raw || typeof raw !== 'object' || typeof raw === 'string') {
    return {
      id: 0,
      sku: '',
      mainSku: '',
      description: 'N/A',
      status: 'Active',
      Date_d_m_y: 'N/A',
      createdDate: 'N/A',
      supplier: 'N/A',
      Supplier: 'N/A',
      location: 'N/A',
      subSkus: []
    };
  }

  // Fallback to first SubSKU if supplier/location/createdDate exist only on variants
  const firstSub = Array.isArray(raw.subSkus || raw.SubSkus) && (raw.subSkus || raw.SubSkus).length > 0
    ? (raw.subSkus || raw.SubSkus)[0]
    : {};

  // Extract date cleanly from createdDate, CreatedDate, or subSKU
  const extractedDate = raw.Date_d_m_y 
    ?? raw.createdDate 
    ?? raw.CreatedDate 
    ?? firstSub.createdDate 
    ?? firstSub.CreatedDate 
    ?? 'N/A';

  // Extract supplier name cleanly
  const extractedSupplier = raw.supplier 
    ?? raw.supplierName 
    ?? raw.SupplierName 
    ?? firstSub.supplierName 
    ?? firstSub.SupplierName 
    ?? firstSub.supplier 
    ?? 'N/A';

  // Extract location cleanly
  const extractedLocation = raw.location 
    ?? raw.Location 
    ?? firstSub.location 
    ?? firstSub.Location 
    ?? 'N/A';

  return {
    id: raw.id ?? raw.Id ?? 0,
    sku: raw.sku ?? raw.Sku ?? '',
    mainSku: raw.mainSku ?? raw.MainSku ?? '',
    description: raw.description ?? raw.Description ?? '',
    status: raw.status ?? raw.Status ?? 'Active',

    // Matches template bindings in HTML:
    Date_d_m_y: extractedDate,
    createdDate: extractedDate,
    supplier: extractedSupplier,
    Supplier: extractedSupplier,
    location: extractedLocation,

    subSkus: Array.isArray(raw.subSkus || raw.SubSkus)
      ? (raw.subSkus || raw.SubSkus).map((s: any) => ({
          id: s.id ?? s.Id ?? 0,
          subSku: s.subSku ?? s.SubSku ?? s.subSkuCode ?? s.SubSkuCode ?? '',
          qty: s.qty ?? s.Qty ?? 0,
          size: s.size ?? s.Size ?? '-',
          description: s.description ?? s.Description ?? '',
          status: s.status ?? s.Status ?? 'Active',
          imageUrl: s.imageUrl ?? s.ImageUrl ?? '',
          supplierName: s.supplierName ?? s.SupplierName ?? extractedSupplier,
          location: s.location ?? s.Location ?? extractedLocation,
          createdDate: s.createdDate ?? s.CreatedDate ?? extractedDate,
          Date_d_m_y: s.createdDate ?? s.CreatedDate ?? extractedDate
        }))
      : []
  };
}