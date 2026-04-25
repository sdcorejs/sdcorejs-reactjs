import type { CSSProperties, ReactNode } from 'react';

export type SdAnchorDirection = 'vertical' | 'horizontal';

export interface SdAnchorItem {
  id: string;
  title: string;
  icon?: ReactNode;
  children?: Omit<SdAnchorItem, 'children'>[];
}

export interface SdAnchorProps {
  items: SdAnchorItem[];
  direction?: SdAnchorDirection;
  sidebarWidth?: string | number;
  ellipsis?: boolean;
  affix?: boolean;
  offsetTop?: number;
  containerHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onActiveChange?: (id: string) => void;
}

export interface SdAnchorSectionProps {
  id: string;
  title?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
