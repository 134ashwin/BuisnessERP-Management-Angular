/**
 * Type Definitions and Common Interfaces
 * Shared types used across the application
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface IResponseError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface IPage<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ILoadingState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface IAsyncState<T> {
  status: LoadingStatus;
  data: T | null;
  error: string | null;
  isLoading: boolean;
}
