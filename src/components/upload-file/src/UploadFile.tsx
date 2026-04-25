import React, { useCallback } from 'react';
import { Upload, message, Typography } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload';
import type { SdUploadFileProps, SdUploadFile, SdUploadRequestOptions } from './upload-file.models';
import { SD_COLOR_MAP } from '../../../models';
import { SdButton } from '../../button';

const { Dragger } = Upload;
const { Text } = Typography;

function toAntFile(f: SdUploadFile): UploadFile {
  return {
    uid: f.uid,
    name: f.name,
    size: f.size,
    type: f.type,
    url: f.url,
    status: f.status,
    percent: f.percent,
    response: f.response,
    originFileObj: f.originFileObj as RcFile,
  };
}

function fromAntFile(f: UploadFile): SdUploadFile {
  return {
    uid: f.uid,
    name: f.name,
    size: f.size,
    type: f.type,
    url: f.url,
    status: f.status,
    percent: f.percent,
    response: f.response,
    originFileObj: f.originFileObj,
  };
}

export const SdUploadFile: React.FC<SdUploadFileProps> = ({
  value = [],
  multiple = false,
  maxCount,
  maxSize,
  accept,
  listType = 'text',
  disabled = false,
  dragAndDrop = false,
  label,
  hint,
  color = 'primary',
  size = 'md',
  className,
  style,
  customRequest,
  onChange,
  onRemove,
  onPreview,
}) => {
  const accentColor = SD_COLOR_MAP[color];

  const handleBeforeUpload = useCallback(
    (file: RcFile): boolean => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        message.error(`File phải nhỏ hơn ${maxSize}MB`);
        return false;
      }
      return true;
    },
    [maxSize],
  );

  const handleChange: UploadProps['onChange'] = useCallback(
    ({ fileList }) => {
      onChange?.(fileList.map(fromAntFile));
    },
    [onChange],
  );

  const handleCustomRequest = useCallback(
    (options: Parameters<NonNullable<UploadProps['customRequest']>>[0]) => {
      if (!customRequest) {
        options.onSuccess?.({});
        return;
      }
      customRequest({
        file: options.file as File,
        onProgress: (percent) => options.onProgress?.({ percent } as ProgressEvent),
        onSuccess: (res) => options.onSuccess?.(res),
        onError: (err) => options.onError?.(err),
      } as SdUploadRequestOptions);
    },
    [customRequest],
  );

  const resolvedAccept = Array.isArray(accept) ? accept.join(',') : accept;

  const uploadProps: UploadProps = {
    fileList: value.map(toAntFile),
    multiple,
    maxCount,
    accept: resolvedAccept,
    listType,
    disabled,
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
    onRemove: onRemove ? (f) => onRemove(fromAntFile(f)) : undefined,
    onPreview: onPreview ? (f) => onPreview(fromAntFile(f)) : undefined,
    customRequest: handleCustomRequest,
  };

  const content = dragAndDrop ? (
    <Dragger {...uploadProps} className={className} style={{ ...style }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: accentColor }} />
      </p>
      <p className="ant-upload-text">Kéo thả file vào đây hoặc click để tải lên</p>
      {hint && <p className="ant-upload-hint">{hint}</p>}
    </Dragger>
  ) : (
    <Upload {...uploadProps}>
      {(!maxCount || value.length < maxCount) && (
        <SdButton
          variant="outline"
          color={color}
          size={size}
          icon={<UploadOutlined />}
          disabled={disabled}
        >
          Tải file lên
        </SdButton>
      )}
    </Upload>
  );

  return (
    <div className={!dragAndDrop ? className : undefined} style={!dragAndDrop ? style : undefined}>
      {label && (
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          {label}
        </Text>
      )}
      {content}
      {!dragAndDrop && hint && (
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {hint}
        </Text>
      )}
    </div>
  );
};
