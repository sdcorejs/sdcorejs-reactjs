import type { CSSProperties, Key, ReactNode } from 'react';
import type { SdColor, SdFilter, SdOrder, SdPagingReq, SdPagingRes } from '../../../models';

// ─── Column Types ────────────────────────────────────────────────────────────

export interface SdTableBadge<T> {
  value: unknown;
  label: string;
  color?: SdColor | string;
}

interface SdTableColumnBase<T> {
  key: string;
  title: ReactNode;
  dataIndex?: string;
  width?: number | string;
  minWidth?: number | string;
  fixed?: 'left' | 'right';
  hidden?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  tooltip?: (row: T) => string;
  className?: string | ((row: T) => string);
  onClick?: (row: T) => void;
}

export interface SdTableColumnText<T> extends SdTableColumnBase<T> {
  type: 'text';
  maxChars?: number;
  copiable?: boolean;
  badges?: SdTableBadge<T>[];
  transform?: (value: string, row: T) => string;
}

export interface SdTableColumnNumber<T> extends SdTableColumnBase<T> {
  type: 'number';
  format?: string;
  suffix?: string;
  transform?: (value: number, row: T) => number;
}

export interface SdTableColumnBoolean<T> extends SdTableColumnBase<T> {
  type: 'boolean';
  trueText?: string;
  falseText?: string;
  trueColor?: SdColor;
  falseColor?: SdColor;
}

export interface SdTableColumnDate<T> extends SdTableColumnBase<T> {
  type: 'date';
  format?: string;
}

export interface SdTableColumnDatetime<T> extends SdTableColumnBase<T> {
  type: 'datetime';
  format?: string;
}

export interface SdTableColumnValues<T> extends SdTableColumnBase<T> {
  type: 'values';
  options: { label: string; value: unknown; color?: SdColor | string }[];
  multiple?: boolean;
}

export interface SdTableColumnLazyValues<T> extends SdTableColumnBase<T> {
  type: 'lazy-values';
  load: (value: unknown) => Promise<string>;
}

export interface SdTableColumnCustom<T> extends SdTableColumnBase<T> {
  type: 'custom';
  render: (value: unknown, row: T, index: number) => ReactNode;
}

export type SdTableColumn<T> =
  | SdTableColumnText<T>
  | SdTableColumnNumber<T>
  | SdTableColumnBoolean<T>
  | SdTableColumnDate<T>
  | SdTableColumnDatetime<T>
  | SdTableColumnValues<T>
  | SdTableColumnLazyValues<T>
  | SdTableColumnCustom<T>;

// ─── Commands ────────────────────────────────────────────────────────────────

export interface SdTableCommand<T> {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  color?: SdColor;
  disabled?: boolean | ((row: T) => boolean);
  hidden?: boolean | ((row: T) => boolean);
  confirm?: string | boolean;
  onClick: (row: T) => void | Promise<void>;
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

export interface SdTableLocalData<T> {
  mode: 'local';
  data: T[];
}

export interface SdTableServerData<T> {
  mode: 'server';
  load: (req: SdPagingReq<T>) => Promise<SdPagingRes<T>>;
}

export type SdTableData<T> = SdTableLocalData<T> | SdTableServerData<T>;

// ─── Table Options ─────────────────────────────────────────────────────────────

export interface SdTablePaginationOption {
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showTotal?: boolean;
}

export interface SdTableSortOption<T> {
  multiple?: boolean;
  defaultSort?: SdOrder<T>[];
}

export interface SdTableFilterOption<T> {
  defaultFilters?: SdFilter<T>[];
}

export interface SdTableSelectorOption<T> {
  type: 'checkbox' | 'radio';
  selectedKeys?: Key[];
  onChange?: (keys: Key[], rows: T[]) => void;
}

export interface SdTableExpandOption<T> {
  render: (row: T) => ReactNode;
  rowExpandable?: (row: T) => boolean;
  expandedRowKeys?: Key[];
  onExpand?: (expanded: boolean, row: T) => void;
}

export interface SdTableExportOption {
  enabled?: boolean;
  fileName?: string;
}

export interface SdTableOption<T extends object> {
  data: SdTableData<T>;
  columns: SdTableColumn<T>[];
  rowKey: keyof T | ((row: T) => string | number);
  commands?: SdTableCommand<T>[];
  commandsTitle?: string;
  commandsWidth?: number;
  commandsFixed?: 'left' | 'right';
  selector?: SdTableSelectorOption<T>;
  pagination?: SdTablePaginationOption | false;
  sort?: SdTableSortOption<T>;
  filter?: SdTableFilterOption<T>;
  expand?: SdTableExpandOption<T>;
  export?: SdTableExportOption;
  scroll?: { x?: number | string; y?: number | string };
  size?: 'default' | 'middle' | 'small';
  bordered?: boolean;
  loading?: boolean;
  emptyText?: ReactNode;
  showHeader?: boolean;
  sticky?: boolean;
  className?: string;
  style?: CSSProperties;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}
