import React, { useState } from 'react';
import { Card, Spin, Button, Space } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import type { SdSectionProps } from './section.models';
import { SD_COLOR_MAP } from '../../../models';

export const SdSection: React.FC<SdSectionProps> = ({
  title,
  subtitle,
  color = 'primary',
  bordered = true,
  collapsible = false,
  defaultCollapsed = false,
  loading = false,
  actions,
  extra,
  className,
  style,
  bodyStyle,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const accentColor = SD_COLOR_MAP[color];

  const extraContent = (
    <Space size={4}>
      {actions
        ?.filter((a) => !a.hidden)
        .map((action) => (
          <span key={action.key}>
            <Button
              type="text"
              size="small"
              icon={action.icon}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          </span>
        ))}
      {extra}
      {collapsible && (
        <Button
          type="text"
          size="small"
          icon={collapsed ? <RightOutlined /> : <DownOutlined />}
          onClick={() => setCollapsed((v) => !v)}
        />
      )}
    </Space>
  );

  const titleNode = title ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 8 }}>{title}</span>
      {subtitle && (
        <span style={{ fontSize: 12, color: '#8c8c8c', paddingLeft: 11 }}>{subtitle}</span>
      )}
    </div>
  ) : undefined;

  return (
    <Card
      title={titleNode}
      extra={extraContent}
      bordered={bordered}
      className={className}
      style={style}
      styles={{ body: { ...bodyStyle, display: collapsed ? 'none' : undefined } }}
    >
      <Spin spinning={loading}>{children}</Spin>
    </Card>
  );
};
