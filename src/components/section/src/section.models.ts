import type { CSSProperties, ReactNode } from 'react';
import type { SdColor } from '../../../models';

export interface SdSectionAction {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

export interface SdSectionProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  color?: SdColor;
  bordered?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  loading?: boolean;
  actions?: SdSectionAction[];
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  children?: ReactNode;
}
