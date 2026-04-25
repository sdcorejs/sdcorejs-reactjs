import type { SdFilter } from './filter.model';

export interface SdOrder<T = unknown> {
  field: keyof T | string;
  direction: 'asc' | 'desc';
}

export interface SdPagingReq<T = unknown> {
  pageSize?: number;
  pageNumber?: number;
  orders?: SdOrder<T>[];
  filters?: SdFilter<T>[];
}

export interface SdPagingRes<T = unknown> {
  items: T[];
  total: number;
}

export type SdSearchFn<T = unknown> = (args: {
  search: string;
  pageNumber: number;
  pageSize: number;
}) => Promise<T[]>;
