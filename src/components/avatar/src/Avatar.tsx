import React, { useState } from 'react';
import { Avatar } from 'antd';
import type { SdAvatarProps } from './avatar.models';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function getColorFromString(str: string): string {
  const PALETTE = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae',
    '#1677ff', '#52c41a', '#eb2f96', '#722ed1',
    '#13c2c2', '#fa8c16',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function isUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
}

export const SdAvatar: React.FC<SdAvatarProps> = ({
  src,
  name = '',
  size = 32,
  shape = 'circle',
  className,
  style,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const showImage = src && isUrl(src) && !imgError;
  const initials = getInitials(name);
  const bgColor = getColorFromString(name || src || 'default');

  const commonProps = {
    size,
    shape,
    className,
    style: { cursor: onClick ? 'pointer' : undefined, ...style },
    onClick,
  };

  if (showImage) {
    return (
      <Avatar
        {...commonProps}
        src={src}
        onError={() => {
          setImgError(true);
          return true;
        }}
      />
    );
  }

  return (
    <Avatar {...commonProps} style={{ backgroundColor: bgColor, ...commonProps.style }}>
      {initials || (name?.[0]?.toUpperCase() ?? '?')}
    </Avatar>
  );
};
