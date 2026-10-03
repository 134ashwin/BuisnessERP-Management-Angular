/**
 * SubSkuDetail Model (Child Variant Entity)
 * 
 * NORMALIZED ARCHITECTURE:
 * Supplier and Location have been lifted to the root Product entity to eliminate
 * redundant data duplication across variants (3NF Normalization).
 * 
 * Required Fields: SubSku, Size, Status, Description, Date_d_m_y
 */
export interface SubSkuDetail {
  id: number;
  subSku: string;              // Required: Variant SKU code (SubSku)
  size: string;
  qty: string;        // Required: Variant Size (e.g., 'S', 'M', 'L', 'XL', '42', '10.5')
  description?: string;        // Variant-level description or specification
  status?: string;             // Variant inventory status (e.g., 'In Stock', 'Low Stock')
  imageUrl?: string;           // Variant product image URL
  Date_d_m_y?: string;         // Variant record date (d/m/y format)

  // Resilient casing aliases for seamless API integration
  SubSku?: string;
  //Size?: string;
  Description?: string;
  Status?: string;
  date_d_m_y?: string;
}