import React from 'react';
import { Drawer, Spin, Typography } from 'antd';
import type { SdSideDrawerProps } from './side-drawer.models';
import { SD_COLOR_MAP } from '../../../models';

const { Text } = Typography;

export const SdSideDrawer: React.FC<SdSideDrawerProps> = ({
  open,
  title,
  subtitle,
  color = 'primary',
  width = 480,
  height,
  placement = 'right',
  closable = true,
  maskClosable = false,
  destroyOnClose = true,
  loading = false,
  footer,
  extra,
  className,
  style,
  bodyStyle,
  children,
  onClose,
}) => {
  const accentColor = SD_COLOR_MAP[color];

  const titleNode =
    title != null ? (
      <div style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
        {subtitle && (
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            {subtitle}
          </Text>
        )}
      </div>
    ) : undefined;

  return (
    <Drawer
      open={open}
      title={titleNode}
      width={placement === 'left' || placement === 'right' ? width : undefined}
      height={placement === 'top' || placement === 'bottom' ? (height ?? 480) : undefined}
      placement={placement}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      footer={footer}
      extra={extra}
      className={className}
      style={style}
      styles={{ body: bodyStyle }}
      onClose={onClose}
    >
      <Spin spinning={loading}>{children}</Spin>
    </Drawer>
  );
};
