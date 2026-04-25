export type SdOperator =
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'CONTAIN'
  | 'NOT_CONTAIN'
  | 'START_WITH'
  | 'END_WITH'
  | 'BETWEEN'
  | 'NOT_BETWEEN'
  | 'NULL'
  | 'NOT_NULL'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL';

export const SD_OPERATOR_LABELS: Record<SdOperator, string> = {
  EQUAL: 'Bằng',
  NOT_EQUAL: 'Không bằng',
  CONTAIN: 'Chứa',
  NOT_CONTAIN: 'Không chứa',
  START_WITH: 'Bắt đầu bằng',
  END_WITH: 'Kết thúc bằng',
  BETWEEN: 'Trong khoảng',
  NOT_BETWEEN: 'Ngoài khoảng',
  NULL: 'Không có giá trị',
  NOT_NULL: 'Có giá trị',
  GREATER_THAN: 'Lớn hơn',
  GREATER_THAN_OR_EQUAL: 'Lớn hơn hoặc bằng',
  LESS_THAN: 'Nhỏ hơn',
  LESS_THAN_OR_EQUAL: 'Nhỏ hơn hoặc bằng',
};

export interface SdFilterHasData<T = unknown> {
  field: keyof T | string;
  operator: Exclude<SdOperator, 'BETWEEN' | 'NOT_BETWEEN' | 'NULL' | 'NOT_NULL'>;
  value: unknown;
}

export interface SdFilterBetween<T = unknown> {
  field: keyof T | string;
  operator: 'BETWEEN' | 'NOT_BETWEEN';
  from: unknown;
  to: unknown;
}

export interface SdFilterNoData<T = unknown> {
  field: keyof T | string;
  operator: 'NULL' | 'NOT_NULL';
}

export type SdFilter<T = unknown> =
  | SdFilterHasData<T>
  | SdFilterBetween<T>
  | SdFilterNoData<T>;
