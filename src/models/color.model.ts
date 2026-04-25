export type SdColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export const SD_COLOR_MAP: Record<SdColor, string> = {
  primary: '#1677ff',
  secondary: '#6b7280',
  info: '#0ea5e9',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
};

export const SD_COLOR_LIGHT_MAP: Record<SdColor, string> = {
  primary: '#e6f4ff',
  secondary: '#f3f4f6',
  info: '#e0f2fe',
  success: '#f6ffed',
  warning: '#fffbe6',
  error: '#fff2f0',
};

export const SD_ANT_STATUS_MAP: Record<
  SdColor,
  'success' | 'processing' | 'error' | 'warning' | 'default'
> = {
  primary: 'processing',
  secondary: 'default',
  info: 'processing',
  success: 'success',
  warning: 'warning',
  error: 'error',
};
