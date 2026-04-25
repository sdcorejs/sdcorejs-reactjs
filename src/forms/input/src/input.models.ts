import type { CSSProperties, FocusEvent, KeyboardEvent, ReactNode } from 'react';
import type { SdSize } from '../../../models';

export type SdInputType = 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'textarea';
export type SdPatternType = 'email' | 'phone' | 'number' | 'integer' | 'decimal';

export const SD_INPUT_PATTERNS: Record<SdPatternType, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9+\-\s()]{7,15}$/,
  number: /^-?(\d+\.?\d*|\.\d+)$/,
  integer: /^-?\d+$/,
  decimal: /^-?\d+(\.\d+)?$/,
};

export interface SdInputRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: SdPatternType | RegExp | string;
  message?: string;
  validator?: (value: string) => string | null | Promise<string | null>;
}

export interface SdInputProps {
  value?: string | number;
  defaultValue?: string | number;
  label?: string;
  placeholder?: string;
  helperText?: string;
  type?: SdInputType;
  size?: SdSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  rules?: SdInputRule[];
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  maxLength?: number;
  showCount?: boolean;
  rows?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  allowClear?: boolean;
  className?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  status?: 'error' | 'warning';
  errorMessage?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
