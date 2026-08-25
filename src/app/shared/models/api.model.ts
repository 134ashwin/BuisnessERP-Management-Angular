/**
 * API Response Wrapper Model - Consistent response format
 */
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  code: number;
  timestamp: Date;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
