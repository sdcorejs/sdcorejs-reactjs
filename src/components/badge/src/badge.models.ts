import type { CSSProperties, ReactNode } from 'react';
import type { SdColor } from '../../../models';

export type SdBadgeVariant = 'filled' | 'light' | 'outline';

export interface SdBadgeProps {
  label?: ReactNode;
  color?: SdColor | string;
  variant?: SdBadgeVariant;
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
