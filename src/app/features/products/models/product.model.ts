import { SubSkuDetail } from './SubSkuDetail.model';
export interface Product {
  id: number;
  sku: string;
  mainSku: string;
  subSkus: SubSkuDetail[];
  isExpanded?: boolean; // UI state flag for expandable detail rows
}