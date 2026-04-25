export type SdSize = 'xs' | 'sm' | 'md' | 'lg';

export const SD_SIZE_ANT_MAP: Record<SdSize, 'small' | 'middle' | 'large'> = {
  xs: 'small',
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

export const SD_SIZE_PX_MAP: Record<SdSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
};
