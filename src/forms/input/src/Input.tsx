import React, { useId, useState, useCallback } from 'react';
import { Input, InputNumber, Form, Typography } from 'antd';
import type { SdInputProps, SdInputRule } from './input.models';
import { SD_INPUT_PATTERNS } from './input.models';
import { SD_SIZE_ANT_MAP } from '../../../models';

const { TextArea, Password } = Input;
const { Text } = Typography;

function validateRules(value: string, rules?: SdInputRule[]): string | null {
  if (!rules?.length) return null;
  for (const rule of rules) {
    if (rule.required && !value?.trim()) {
      return rule.message ?? 'Trường này là bắt buộc';
    }
    if (value && rule.minLength != null && value.length < rule.minLength) {
      return rule.message ?? `Tối thiểu ${rule.minLength} ký tự`;
    }
    if (value && rule.maxLength != null && value.length > rule.maxLength) {
      return rule.message ?? `Tối đa ${rule.maxLength} ký tự`;
    }
    if (value && rule.pattern) {
      let re: RegExp;
      if (rule.pattern instanceof RegExp) {
        re = rule.pattern;
      } else if (rule.pattern in SD_INPUT_PATTERNS) {
        re = SD_INPUT_PATTERNS[rule.pattern as keyof typeof SD_INPUT_PATTERNS];
      } else {
        re = new RegExp(rule.pattern);
      }
      if (!re.test(value)) {
        return rule.message ?? 'Giá trị không hợp lệ';
      }
    }
  }
  return null;
}

export const SdInput: React.FC<SdInputProps> = ({
  value,
  defaultValue,
  label,
  placeholder,
  helperText,
  type = 'text',
  size = 'md',
  disabled = false,
  readOnly = false,
  required = false,
  rules,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  maxLength,
  showCount = false,
  rows = 4,
  autoSize,
  allowClear = false,
  className,
  style,
  inputStyle,
  status: externalStatus,
  errorMessage: externalError,
  onChange,
  onBlur,
  onFocus,
  onPressEnter,
}) => {
  const uid = useId();
  const [internalError, setInternalError] = useState<string | null>(null);

  const allRules: SdInputRule[] = [...(rules ?? [])];
  if (required) allRules.unshift({ required: true });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setInternalError(validateRules(v, allRules));
      onChange?.(v);
    },
    [allRules, onChange],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInternalError(validateRules(String(e.target.value ?? ''), allRules));
      onBlur?.(e);
    },
    [allRules, onBlur],
  );

  const errorMsg = externalError ?? internalError;
  const resolvedStatus = externalStatus ?? (errorMsg ? 'error' : undefined);
  const antSize = SD_SIZE_ANT_MAP[size];

  const commonProps = {
    id: uid,
    disabled,
    readOnly,
    maxLength,
    showCount,
    allowClear,
    status: resolvedStatus,
    style: inputStyle,
    placeholder,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus,
  };

  let inputNode: React.ReactNode;

  if (type === 'textarea') {
    inputNode = (
      <TextArea
        {...commonProps}
        value={value as string}
        defaultValue={defaultValue as string}
        rows={rows}
        autoSize={autoSize}
        onPressEnter={onPressEnter as React.KeyboardEventHandler<HTMLTextAreaElement>}
      />
    );
  } else if (type === 'password') {
    inputNode = (
      <Password
        {...commonProps}
        size={antSize}
        value={value as string}
        defaultValue={defaultValue as string}
        prefix={prefix}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        onPressEnter={onPressEnter as React.KeyboardEventHandler<HTMLInputElement>}
      />
    );
  } else if (type === 'number') {
    inputNode = (
      <InputNumber
        id={uid}
        size={antSize}
        disabled={disabled}
        readOnly={readOnly}
        style={{ width: '100%', ...inputStyle }}
        status={resolvedStatus}
        value={value as number}
        defaultValue={defaultValue as number}
        placeholder={placeholder}
        prefix={prefix}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        onChange={(v) => {
          onChange?.(String(v ?? ''));
        }}
      />
    );
  } else {
    inputNode = (
      <Input
        {...commonProps}
        type={type}
        size={antSize}
        value={value as string}
        defaultValue={defaultValue as string}
        prefix={prefix}
        suffix={suffix}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        onPressEnter={onPressEnter as React.KeyboardEventHandler<HTMLInputElement>}
      />
    );
  }

  return (
    <div className={className} style={style}>
      {label && (
        <label
          htmlFor={uid}
          style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}
        >
          {required && <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>}
          {label}
        </label>
      )}
      {inputNode}
      {errorMsg && (
        <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {errorMsg}
        </Text>
      )}
      {!errorMsg && helperText && (
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {helperText}
        </Text>
      )}
    </div>
  );
};
