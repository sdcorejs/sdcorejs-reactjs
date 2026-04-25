import React, { useCallback } from 'react';
import {
  Select,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Dropdown,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import type {
  SdQueryBuilderProps,
  SdQueryField,
  SdQueryGroup,
  SdQueryRule,
} from './query-builder.models';
import {
  SD_QUERY_BETWEEN_OPS,
  SD_QUERY_NO_VALUE_OPS,
  SD_QUERY_OPERATORS_BY_TYPE,
  createEmptyGroup,
  createEmptyRule,
  isGroup,
  removeById,
  updateGroupById,
  updateRuleById,
} from './query-builder.models';
import { SD_OPERATOR_LABELS } from '../../../models';

const { Text } = Typography;

// ─── Value input ──────────────────────────────────────────────────────────────

interface ValueInputProps {
  rule: SdQueryRule;
  field: SdQueryField | undefined;
  readOnly: boolean;
  onChange: (id: string, patch: Partial<SdQueryRule>) => void;
}

const ValueInput: React.FC<ValueInputProps> = ({ rule, field, readOnly, onChange }) => {
  if (!field || SD_QUERY_NO_VALUE_OPS.has(rule.operator)) return null;

  if (SD_QUERY_BETWEEN_OPS.has(rule.operator)) {
    if (field.type === 'date' || field.type === 'datetime') {
      const fmt = field.type === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
      const antFmt = field.type === 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
      const from = rule.value ? dayjs(rule.value as string) : null;
      const to = rule.valueTo ? dayjs(rule.valueTo as string) : null;
      return (
        <DatePicker.RangePicker
          size="small"
          disabled={readOnly}
          showTime={field.type === 'datetime'}
          format={antFmt}
          value={from && to ? [from, to] : null}
          onChange={(dates) => {
            onChange(rule.id, {
              value: dates?.[0]?.format(fmt) ?? undefined,
              valueTo: dates?.[1]?.format(fmt) ?? undefined,
            });
          }}
          style={{ width: 280 }}
        />
      );
    }
    return (
      <Space.Compact size="small">
        <InputNumber
          placeholder="Từ"
          disabled={readOnly}
          value={rule.value as number}
          onChange={(v) => onChange(rule.id, { value: v ?? undefined })}
          style={{ width: 100 }}
        />
        <InputNumber
          placeholder="Đến"
          disabled={readOnly}
          value={rule.valueTo as number}
          onChange={(v) => onChange(rule.id, { valueTo: v ?? undefined })}
          style={{ width: 100 }}
        />
      </Space.Compact>
    );
  }

  if (field.type === 'boolean') {
    return (
      <Select
        size="small"
        disabled={readOnly}
        value={rule.value as boolean}
        onChange={(v) => onChange(rule.id, { value: v })}
        options={[
          { label: 'Đúng', value: true },
          { label: 'Sai', value: false },
        ]}
        style={{ minWidth: 100 }}
      />
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <Select
        size="small"
        disabled={readOnly}
        value={rule.value}
        onChange={(v) => onChange(rule.id, { value: v })}
        options={field.options as { label: string; value: string | number }[]}
        style={{ minWidth: 140 }}
        showSearch
        filterOption={(input, opt) =>
          (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    );
  }

  if (field.type === 'date' || field.type === 'datetime') {
    const fmt = field.type === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
    const antFmt = field.type === 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    return (
      <DatePicker
        size="small"
        disabled={readOnly}
        showTime={field.type === 'datetime'}
        format={antFmt}
        value={rule.value ? dayjs(rule.value as string) : null}
        onChange={(d) => onChange(rule.id, { value: d?.format(fmt) ?? undefined })}
        style={{ width: 160 }}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <InputNumber
        size="small"
        disabled={readOnly}
        value={rule.value as number}
        onChange={(v) => onChange(rule.id, { value: v ?? undefined })}
        style={{ width: 120 }}
      />
    );
  }

  return (
    <Input
      size="small"
      disabled={readOnly}
      value={rule.value as string}
      onChange={(e) => onChange(rule.id, { value: e.target.value || undefined })}
      style={{ width: 160 }}
    />
  );
};

// ─── Rule row ─────────────────────────────────────────────────────────────────

interface QueryRuleNodeProps {
  rule: SdQueryRule;
  fields: SdQueryField[];
  readOnly: boolean;
  onRuleChange: (id: string, patch: Partial<SdQueryRule>) => void;
  onRemove: (id: string) => void;
}

const QueryRuleNode: React.FC<QueryRuleNodeProps> = ({
  rule,
  fields,
  readOnly,
  onRuleChange,
  onRemove,
}) => {
  const field = fields.find((f) => f.key === rule.field);
  const operators = field
    ? (field.operators ?? SD_QUERY_OPERATORS_BY_TYPE[field.type] ?? [])
    : [];

  const handleFieldChange = (key: string) => {
    onRuleChange(rule.id, { field: key, operator: '', value: undefined, valueTo: undefined });
  };

  const handleOperatorChange = (op: string) => {
    onRuleChange(rule.id, { operator: op, value: undefined, valueTo: undefined });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        background: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: 6,
        flexWrap: 'wrap',
        flex: 1,
      }}
    >
      <Select
        size="small"
        placeholder="Chọn trường"
        value={rule.field || undefined}
        disabled={readOnly}
        onChange={handleFieldChange}
        options={fields.map((f) => ({ label: f.label, value: f.key }))}
        style={{ minWidth: 140 }}
        showSearch
        filterOption={(input, opt) =>
          (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />

      {rule.field && (
        <Select
          size="small"
          placeholder="Toán tử"
          value={rule.operator || undefined}
          disabled={readOnly}
          onChange={handleOperatorChange}
          options={operators.map((op) => ({
            label: SD_OPERATOR_LABELS[op as keyof typeof SD_OPERATOR_LABELS] ?? op,
            value: op,
          }))}
          style={{ minWidth: 140 }}
        />
      )}

      {rule.field && rule.operator && (
        <ValueInput rule={rule} field={field} readOnly={readOnly} onChange={onRuleChange} />
      )}

      {!readOnly && (
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(rule.id)}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        />
      )}
    </div>
  );
};

// ─── Group node ───────────────────────────────────────────────────────────────

interface QueryGroupNodeProps {
  group: SdQueryGroup;
  fields: SdQueryField[];
  depth: number;
  maxDepth: number;
  isRoot: boolean;
  readOnly: boolean;
  onGroupChange: (id: string, patch: Partial<SdQueryGroup>) => void;
  onAddRule: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemove: (id: string) => void;
  onRuleChange: (id: string, patch: Partial<SdQueryRule>) => void;
}

const QueryGroupNode: React.FC<QueryGroupNodeProps> = ({
  group,
  fields,
  depth,
  maxDepth,
  isRoot,
  readOnly,
  onGroupChange,
  onAddRule,
  onAddGroup,
  onRemove,
  onRuleChange,
}) => {
  const canNest = depth < maxDepth;

  const addMenuItems: MenuProps['items'] = [
    { key: 'rule', label: 'Thêm điều kiện', icon: <PlusOutlined /> },
    ...(canNest
      ? [{ key: 'group', label: 'Thêm nhóm', icon: <PlusOutlined /> }]
      : []),
  ];

  const conditionColor = group.condition === 'AND' ? '#1677ff' : '#52c41a';

  return (
    <div style={{ position: 'relative' }}>
      {/* Group header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          background: '#fff',
          border: `1px solid ${conditionColor}40`,
          borderLeft: `3px solid ${conditionColor}`,
          borderRadius: 6,
          marginBottom: 8,
        }}
      >
        {/* AND/OR toggle */}
        <Space.Compact size="small">
          <Button
            size="small"
            type={group.condition === 'AND' ? 'primary' : 'default'}
            onClick={() => !readOnly && onGroupChange(group.id, { condition: 'AND' })}
            style={{ minWidth: 48 }}
          >
            AND
          </Button>
          <Button
            size="small"
            type={group.condition === 'OR' ? 'primary' : 'default'}
            onClick={() => !readOnly && onGroupChange(group.id, { condition: 'OR' })}
            style={{
              minWidth: 48,
              ...(group.condition === 'OR' ? { background: '#52c41a', borderColor: '#52c41a' } : {}),
            }}
          >
            OR
          </Button>
        </Space.Compact>

        {!readOnly && (
          <Dropdown
            menu={{
              items: addMenuItems,
              onClick: ({ key }) => {
                if (key === 'rule') onAddRule(group.id);
                if (key === 'group') onAddGroup(group.id);
              },
            }}
            trigger={['click']}
          >
            <Button size="small" icon={<PlusOutlined />}>
              Thêm <DownOutlined />
            </Button>
          </Dropdown>
        )}

        {!isRoot && !readOnly && (
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemove(group.id)}
            style={{ marginLeft: 'auto' }}
          />
        )}

        {group.rules.length === 0 && (
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
            Chưa có điều kiện nào
          </Text>
        )}
      </div>

      {/* Rules body with tree lines */}
      {group.rules.length > 0 && (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          {/* Vertical tree line */}
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: 0,
              bottom: 16,
              width: 0,
              borderLeft: '1px dashed #d9d9d9',
              pointerEvents: 'none',
            }}
          />

          {group.rules.map((item) => (
            <div key={item.id} style={{ position: 'relative', marginBottom: 8 }}>
              {/* Horizontal connector */}
              <div
                style={{
                  position: 'absolute',
                  left: -13,
                  top: isGroup(item) ? 18 : '50%',
                  transform: isGroup(item) ? undefined : 'translateY(-50%)',
                  width: 13,
                  height: 0,
                  borderTop: '1px dashed #d9d9d9',
                  pointerEvents: 'none',
                }}
              />

              {isGroup(item) ? (
                <QueryGroupNode
                  group={item}
                  fields={fields}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  isRoot={false}
                  readOnly={readOnly}
                  onGroupChange={onGroupChange}
                  onAddRule={onAddRule}
                  onAddGroup={onAddGroup}
                  onRemove={onRemove}
                  onRuleChange={onRuleChange}
                />
              ) : (
                <QueryRuleNode
                  rule={item}
                  fields={fields}
                  readOnly={readOnly}
                  onRuleChange={onRuleChange}
                  onRemove={onRemove}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────

export const SdQueryBuilder: React.FC<SdQueryBuilderProps> = ({
  value,
  fields,
  onChange,
  maxDepth = 3,
  readOnly = false,
  className,
  style,
}) => {
  const notify = useCallback((next: SdQueryGroup) => onChange?.(next), [onChange]);

  const handleGroupChange = useCallback(
    (id: string, patch: Partial<SdQueryGroup>) => {
      notify(updateGroupById(value, id, (g) => ({ ...g, ...patch })));
    },
    [value, notify],
  );

  const handleAddRule = useCallback(
    (groupId: string) => {
      notify(
        updateGroupById(value, groupId, (g) => ({
          ...g,
          rules: [...g.rules, createEmptyRule()],
        })),
      );
    },
    [value, notify],
  );

  const handleAddGroup = useCallback(
    (groupId: string) => {
      notify(
        updateGroupById(value, groupId, (g) => ({
          ...g,
          rules: [...g.rules, createEmptyGroup()],
        })),
      );
    },
    [value, notify],
  );

  const handleRemove = useCallback(
    (id: string) => {
      notify(removeById(value, id));
    },
    [value, notify],
  );

  const handleRuleChange = useCallback(
    (id: string, patch: Partial<SdQueryRule>) => {
      notify(updateRuleById(value, id, (r) => ({ ...r, ...patch })));
    },
    [value, notify],
  );

  return (
    <div className={className} style={style}>
      <QueryGroupNode
        group={value}
        fields={fields}
        depth={0}
        maxDepth={maxDepth}
        isRoot
        readOnly={readOnly}
        onGroupChange={handleGroupChange}
        onAddRule={handleAddRule}
        onAddGroup={handleAddGroup}
        onRemove={handleRemove}
        onRuleChange={handleRuleChange}
      />
    </div>
  );
};
