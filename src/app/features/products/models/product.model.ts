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

  // Resilient casing aliases
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
export function normalizeProduct(data: any): Product {
  const raw = data || {};
  const mainSku = String(raw.mainSku || raw.sku || `MSKU-${raw.id || '01'}`);
  const supplier = String(
    raw.supplier ||
    raw.Supplier ||
    raw['supplierName'] ||
    raw.subSkus?.[0]?.['supplierName'] ||
    raw.subSkus?.[0]?.['supplier'] ||
    'Apex Global Logistics'
  );
  const location = String(
    raw.location ||
    raw.Location ||
    raw.subSkus?.[0]?.['location'] ||
    'Warehouse A · Bay 14'
  );
  const description = String(
    raw.description ||
    raw.Description ||
    `Enterprise inventory catalog item ${mainSku}`
  );
  const status = (raw.status || raw.Status || 'Active') as ProductStatus;
  const Date_d_m_y = String(
    raw.Date_d_m_y ||
    raw.date_d_m_y ||
    raw['createdDate'] ||
    '26/09/2026'
  );

  const subSkus: SubSkuDetail[] = Array.isArray(raw.subSkus)
    ? raw.subSkus.map((sub: any, idx: number) => ({
        id: sub.id ?? (idx + 1),
        subSku: String(sub.subSku || sub.SubSku || `${mainSku}-V${idx + 1}`),
        size: String(sub.size || sub.Size || 'Standard'),
        description: sub.description || sub.Description || description,
        status: sub.status || sub.Status || status,
        imageUrl: sub.imageUrl || sub.image || '',
        Date_d_m_y: String(sub.Date_d_m_y || sub.date_d_m_y || sub['createdDate'] || Date_d_m_y)
      }))
    : [];

  return {
    id: raw.id ?? 0,
    mainSku,
    sku: raw.sku || mainSku,
    supplier,
    location,
    description,
    status,
    Date_d_m_y,
    subSkus,
    isExpanded: Boolean(raw.isExpanded)
  };
}