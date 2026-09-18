export interface SalesOrder {
  id: string;
  orderDate: string;
  orderNo: string;
  mainSku: string;
  subSku: string;
  size: string;
  customer: string;
  description: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface SalesFilter {
  pageNumber: number;
  pageSize: number;
  orderNo?: string;
  date?: string;
}