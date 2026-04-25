import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import type { SdColor } from '../../../models';
import type { SdSize } from '../../../models';

export type SdButtonVariant = 'fill' | 'light' | 'outline' | 'link' | 'text';
export type SdButtonHtmlType = 'button' | 'submit' | 'reset';

export interface SdButtonProps {
  variant?: SdButtonVariant;
  color?: SdColor;
  size?: SdSize;
  htmlType?: SdButtonHtmlType;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  icon?: ReactNode;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  tooltip?: string;
  width?: string | number;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}
