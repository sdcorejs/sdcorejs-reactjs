import type { CSSProperties, ReactNode } from 'react';
import type { SdColor, SdSize } from '../../../models';

export type SdModalWidth = SdSize | string | number;

export interface SdModalFooterAction {
  key: string;
  label: ReactNode;
  variant?: 'fill' | 'light' | 'outline' | 'link' | 'text';
  color?: SdColor;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void | Promise<void>;
  htmlType?: 'button' | 'submit' | 'reset';
  hidden?: boolean;
}

export interface SdModalProps {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  color?: SdColor;
  width?: SdModalWidth;
  height?: string | number;
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  loading?: boolean;
  footer?: ReactNode | SdModalFooterAction[] | null;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  children?: ReactNode;
  onClose?: () => void;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

const MODAL_WIDTH_MAP: Record<SdSize, number> = {
  xs: 360,
  sm: 520,
  md: 720,
  lg: 960,
};

export function resolveModalWidth(width: SdModalWidth): string | number {
  if (typeof width === 'number' || (typeof width === 'string' && /^\d/.test(width))) {
    return width;
  }
  return MODAL_WIDTH_MAP[width as SdSize] ?? 720;
}
