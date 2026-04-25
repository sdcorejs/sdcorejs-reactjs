import React from 'react';
import { Badge, Tag } from 'antd';
import type { SdBadgeProps } from './badge.models';
import { SD_COLOR_MAP, SD_COLOR_LIGHT_MAP, SdColor } from '../../../models';

function resolveColor(color: SdBadgeProps['color']): string {
  if (!color) return SD_COLOR_MAP.secondary;
  return color in SD_COLOR_MAP ? SD_COLOR_MAP[color as SdColor] : color;
}

function resolveLight(color: SdBadgeProps['color']): string {
  if (!color) return SD_COLOR_LIGHT_MAP.secondary;
  return color in SD_COLOR_LIGHT_MAP ? SD_COLOR_LIGHT_MAP[color as SdColor] : `${resolveColor(color)}1a`;
}

export const SdBadge: React.FC<SdBadgeProps> = ({
  label,
  color = 'secondary',
  variant = 'light',
  dot = false,
  count,
  showZero = false,
  className,
  style,
  children,
}) => {
  // When wrapping children with dot/count badge
  if (children != null) {
    return (
      <Badge
        dot={dot}
        count={count}
        showZero={showZero}
        color={resolveColor(color)}
        className={className}
        style={style}
      >
        {children}
      </Badge>
    );
  }

  const hex = resolveColor(color);
  const light = resolveLight(color);

  const tagStyle: React.CSSProperties = { ...style };
  switch (variant) {
    case 'filled':
      tagStyle.backgroundColor = hex;
      tagStyle.borderColor = hex;
      tagStyle.color = '#fff';
      break;
    case 'light':
      tagStyle.backgroundColor = light;
      tagStyle.borderColor = 'transparent';
      tagStyle.color = hex;
      break;
    case 'outline':
      tagStyle.backgroundColor = 'transparent';
      tagStyle.borderColor = hex;
      tagStyle.color = hex;
      break;
  }

  return (
    <Tag className={className} style={tagStyle}>
      {dot && (
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: hex,
            marginRight: 6,
            verticalAlign: 'middle',
          }}
        />
      )}
      {label}
    </Tag>
  );
};
