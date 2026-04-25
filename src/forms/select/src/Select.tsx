import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Select, Spin, Typography } from 'antd';
import type { SdSelectProps, SdSelectOption } from './select.models';
import type { SdSearchFn } from '../../../models';
import { SD_SIZE_ANT_MAP } from '../../../models';

const { Text } = Typography;

function isSearchFn<V>(items: SdSelectProps<V>['items']): items is SdSearchFn<SdSelectOption<V>> {
  return typeof items === 'function';
}

function isGrouped<V>(items: SdSelectOption<V>[]): boolean {
  return items.length > 0 && 'options' in items[0];
}

export function SdSelect<V = unknown>({
  value,
  defaultValue,
  label,
  placeholder = 'Chọn...',
  helperText,
  items,
  multiple = false,
  searchable = true,
  allowClear = true,
  disabled = false,
  required = false,
  size = 'md',
  limit = 50,
  debounce = 400,
  minDropdownWidth,
  maxTagCount = 'responsive',
  className,
  style,
  status: externalStatus,
  errorMessage,
  onChange,
  onSearch,
  onSelection,
}: SdSelectProps<V>): React.ReactElement {
  const uid = useId();
  const [options, setOptions] = useState<SdSelectOption<V>[]>([]);
  const [fetching, setFetching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedRef = useRef<Map<string, SdSelectOption<V>[]>>(new Map());

  const fetchOptions = useCallback(
    async (search: string) => {
      if (!isSearchFn(items)) return;
      const cacheKey = search.trim().toLowerCase();
      if (cachedRef.current.has(cacheKey)) {
        setOptions(cachedRef.current.get(cacheKey)!);
        return;
      }
      setFetching(true);
      try {
        const result = await items({ search, pageNumber: 1, pageSize: limit });
        cachedRef.current.set(cacheKey, result);
        setOptions(result);
      } finally {
        setFetching(false);
      }
    },
    [items, limit],
  );

  useEffect(() => {
    if (isSearchFn(items)) {
      fetchOptions('');
    } else {
      setOptions(items as SdSelectOption<V>[]);
    }
  }, [items, fetchOptions]);

  const handleSearch = useCallback(
    (search: string) => {
      onSearch?.(search);
      if (!isSearchFn(items)) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => fetchOptions(search), debounce);
    },
    [items, debounce, fetchOptions, onSearch],
  );

  const handleChange = useCallback(
    (val: V | V[], opts: SdSelectOption<V> | SdSelectOption<V>[]) => {
      onChange?.(val, opts);
      onSelection?.({
        value: val,
        options: Array.isArray(opts) ? opts : [opts],
      });
    },
    [onChange, onSelection],
  );

  const resolvedStatus = externalStatus ?? (errorMessage ? 'error' : undefined);
  const antSize = SD_SIZE_ANT_MAP[size];

  const selectOptions = isGrouped(options as SdSelectOption<V>[])
    ? (options as unknown as { label: string; options: SdSelectOption<V>[] }[])
    : options;

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
      <Select<V | V[], SdSelectOption<V>>
        id={uid}
        mode={multiple ? 'multiple' : undefined}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        showSearch={searchable || isSearchFn(items)}
        filterOption={isSearchFn(items) ? false : undefined}
        size={antSize}
        status={resolvedStatus}
        maxTagCount={multiple ? maxTagCount : undefined}
        style={{ width: '100%' }}
        popupMatchSelectWidth={minDropdownWidth == null}
        notFoundContent={fetching ? <Spin size="small" /> : 'Không có dữ liệu'}
        options={selectOptions as SdSelectOption<V>[]}
        onChange={handleChange}
        onSearch={handleSearch}
        fieldNames={{ label: 'label', value: 'value' }}
      />
      {errorMessage && (
        <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {errorMessage}
        </Text>
      )}
      {!errorMessage && helperText && (
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          {helperText}
        </Text>
      )}
    </div>
  );
}
