import type { CSSProperties, ReactNode } from 'react';
import type { SdSize, SdSearchFn } from '../../../models';

export interface SdSelectOption<V = unknown> {
  label: ReactNode;
  value: V;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SdSelectGroupOption<V = unknown> {
  label: string;
  options: SdSelectOption<V>[];
}

export type SdSelectItems<V = unknown> =
  | SdSelectOption<V>[]
  | SdSelectGroupOption<V>[]
  | SdSearchFn<SdSelectOption<V>>;

export interface SdSelectionData<V = unknown> {
  value: V | V[];
  options: SdSelectOption<V>[];
}

export interface SdSelectProps<V = unknown> {
  value?: V | V[];
  defaultValue?: V | V[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  items: SdSelectItems<V>;
  multiple?: boolean;
  searchable?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: SdSize;
  limit?: number;
  debounce?: number;
  minDropdownWidth?: string | number;
  maxTagCount?: number | 'responsive';
  className?: string;
  style?: CSSProperties;
  status?: 'error' | 'warning';
  errorMessage?: string;
  onChange?: (value: V | V[], options: SdSelectOption<V> | SdSelectOption<V>[]) => void;
  onSearch?: (search: string) => void;
  onSelection?: (data: SdSelectionData<V>) => void;
}
