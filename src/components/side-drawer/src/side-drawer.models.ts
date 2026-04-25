import type { CSSProperties, ReactNode } from 'react';
import type { SdColor } from '../../../models';

export type SdDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface SdSideDrawerProps {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  color?: SdColor;
  width?: string | number;
  height?: string | number;
  placement?: SdDrawerPlacement;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  loading?: boolean;
  footer?: ReactNode;
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  children?: ReactNode;
  onClose?: () => void;
}
