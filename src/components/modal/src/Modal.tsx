import React, { useState, useCallback } from 'react';
import { Modal, Button, Space, Spin, Typography } from 'antd';
import type { SdModalProps, SdModalFooterAction } from './modal.models';
import { resolveModalWidth } from './modal.models';
import { SD_COLOR_MAP } from '../../../models';
import { SdButton } from '../../button';

const { Text } = Typography;

function isActionArray(footer: SdModalProps['footer']): footer is SdModalFooterAction[] {
  return Array.isArray(footer);
}

const FooterActionButton: React.FC<{ action: SdModalFooterAction }> = ({ action }) => {
  const [btnLoading, setBtnLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!action.onClick) return;
    setBtnLoading(true);
    try {
      await action.onClick();
    } finally {
      setBtnLoading(false);
    }
  }, [action]);

  return (
    <SdButton
      variant={action.variant ?? 'light'}
      color={action.color ?? 'secondary'}
      disabled={action.disabled}
      loading={action.loading ?? btnLoading}
      htmlType={action.htmlType}
      onClick={handleClick}
    >
      {action.label}
    </SdButton>
  );
};

export const SdModal: React.FC<SdModalProps> = ({
  open,
  title,
  subtitle,
  color = 'primary',
  width = 'sm',
  height,
  centered = true,
  closable = true,
  maskClosable = false,
  destroyOnClose = true,
  loading = false,
  footer,
  className,
  style,
  bodyStyle,
  children,
  onClose,
  onOk,
  onCancel,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const accentColor = SD_COLOR_MAP[color];

  const handleOk = useCallback(async () => {
    if (!onOk) return;
    setConfirmLoading(true);
    try {
      await onOk();
    } finally {
      setConfirmLoading(false);
    }
  }, [onOk]);

  const resolvedWidth = resolveModalWidth(width);

  const titleNode = (
    <div style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 10 }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
      {subtitle && (
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
          {subtitle}
        </Text>
      )}
    </div>
  );

  let footerNode: React.ReactNode;
  if (footer === null) {
    footerNode = null;
  } else if (footer === undefined) {
    footerNode = (
      <Space>
        <Button onClick={onCancel ?? onClose}>Huỷ</Button>
        <Button type="primary" loading={confirmLoading} onClick={handleOk}>
          Xác nhận
        </Button>
      </Space>
    );
  } else if (isActionArray(footer)) {
    footerNode = (
      <Space>
        {footer
          .filter((a) => !a.hidden)
          .map((action) => (
            <FooterActionButton key={action.key} action={action} />
          ))}
      </Space>
    );
  } else {
    footerNode = footer;
  }

  return (
    <Modal
      open={open}
      title={title != null ? titleNode : undefined}
      width={resolvedWidth}
      centered={centered}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      className={className}
      style={style}
      styles={{
        body: {
          height,
          overflowY: height ? 'auto' : undefined,
          ...bodyStyle,
        },
      }}
      footer={footerNode}
      onCancel={onClose ?? onCancel}
      onOk={handleOk}
    >
      <Spin spinning={loading}>{children}</Spin>
    </Modal>
  );
};
