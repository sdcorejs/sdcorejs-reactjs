import React, { CSSProperties } from 'react';
import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import type { SdButtonProps } from './button.models';
import { SD_COLOR_MAP, SD_COLOR_LIGHT_MAP, SD_SIZE_ANT_MAP } from '../../../models';

const VARIANT_ANT_TYPE_MAP: Record<string, ButtonProps['type']> = {
  fill: 'primary',
  light: 'default',
  outline: 'default',
  link: 'link',
  text: 'text',
};

function buildStyle(
  variant: SdButtonProps['variant'],
  color: SdButtonProps['color'],
  width?: string | number,
  extraStyle?: CSSProperties,
): CSSProperties {
  const style: CSSProperties = { ...extraStyle };
  if (width != null) style.width = width;

  if (!color || color === 'primary') return style;

  const hex = SD_COLOR_MAP[color];
  const light = SD_COLOR_LIGHT_MAP[color];

  switch (variant) {
    case 'fill':
      style.backgroundColor = hex;
      style.borderColor = hex;
      style.color = '#fff';
      break;
    case 'light':
      style.backgroundColor = light;
      style.borderColor = 'transparent';
      style.color = hex;
      break;
    case 'outline':
      style.backgroundColor = 'transparent';
      style.borderColor = hex;
      style.color = hex;
      break;
    case 'link':
    case 'text':
      style.color = hex;
      break;
  }

  return style;
}

export const SdButton: React.FC<SdButtonProps> = ({
  variant = 'light',
  color = 'secondary',
  size = 'sm',
  htmlType = 'button',
  disabled = false,
  loading = false,
  block = false,
  icon,
  prefixIcon,
  suffixIcon,
  tooltip,
  width,
  className,
  style,
  onClick,
  children,
}) => {
  const combinedIcon = icon ?? prefixIcon;

  const btn = (
    <Button
      type={VARIANT_ANT_TYPE_MAP[variant]}
      size={SD_SIZE_ANT_MAP[size]}
      htmlType={htmlType}
      disabled={disabled}
      loading={loading}
      block={block}
      icon={combinedIcon}
      className={className}
      style={buildStyle(variant, color, width, style)}
      onClick={onClick}
    >
      {children}
      {suffixIcon && <span style={{ marginLeft: children ? 4 : 0 }}>{suffixIcon}</span>}
    </Button>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{btn}</Tooltip>;
  }
  return btn;
};
