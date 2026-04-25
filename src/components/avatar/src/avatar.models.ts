import type { CSSProperties } from 'react';

export type SdAvatarShape = 'circle' | 'square';

export interface SdAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  shape?: SdAvatarShape;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}
