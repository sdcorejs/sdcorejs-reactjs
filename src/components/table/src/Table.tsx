import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type {
  SdTableOption,
  SdTableColumn,
  SdTableCommand,
  SdTableColumnBoolean,
  SdTableColumnDate,
  SdTableColumnDatetime,
  SdTableColumnNumber,
  SdTableColumnText,
  SdTableColumnValues,
  SdTableColumnLazyValues,
  SdTableColumnCustom,
  SdTableBadge,
} from './table.models';
import { SD_COLOR_MAP, SD_COLOR_LIGHT_MAP, SdColor } from '../../../models';
import type { SdOrder } from '../../../models';

const { Text } = Typography;

// ─── Cell Renderers ───────────────────────────────────────────────────────────

function renderText<T>(col: SdTableColumnText<T>, value: unknown, row: T): React.ReactNode {
  let str = col.transform ? col.transform(String(value ?? ''), row) : String(value ?? '');

  if (col.badges?.length) {
    const badge = col.badges.find((b) => b.value === value);
    if (badge) {
      const hex = badge.color
        ? badge.color in SD_COLOR_MAP
          ? SD_COLOR_MAP[badge.color as SdColor]
          : badge.color
        : SD_COLOR_MAP.secondary;
      const light = badge.color
        ? badge.color in SD_COLOR_LIGHT_MAP
          ? SD_COLOR_LIGHT_MAP[badge.color as SdColor]
          : `${hex}1a`
        : SD_COLOR_LIGHT_MAP.secondary;
      return (
        <Tag style={{ backgroundColor: light, borderColor: 'transparent', color: hex }}>
          {badge.label}
        </Tag>
      );
    }
  }

  if (col.maxChars && str.length > col.maxChars) {
    const truncated = `${str.slice(0, col.maxChars)}…`;
    return (
      <Tooltip title={str}>
        <span>{truncated}</span>
      </Tooltip>
    );
  }

  if (col.copiable) {
    return <Typography.Text copyable>{str}</Typography.Text>;
  }

  return str || <Text type="secondary">—</Text>;
}

function renderNumber<T>(col: SdTableColumnNumber<T>, value: unknown, row: T): React.ReactNode {
  if (value == null || value === '') return <Text type="secondary">—</Text>;
  const num = col.transform ? col.transform(Number(value), row) : Number(value);
  const formatted = new Intl.NumberFormat('vi-VN').format(num);
  return col.suffix ? `${formatted} ${col.suffix}` : formatted;
}

function renderBoolean<T>(col: SdTableColumnBoolean<T>, value: unknown): React.ReactNode {
  const isTrue = Boolean(value);
  const label = isTrue ? (col.trueText ?? 'Có') : (col.falseText ?? 'Không');
  const colorKey: SdColor = isTrue ? (col.trueColor ?? 'success') : (col.falseColor ?? 'error');
  return (
    <Tag
      style={{
        backgroundColor: SD_COLOR_LIGHT_MAP[colorKey],
        borderColor: 'transparent',
        color: SD_COLOR_MAP[colorKey],
      }}
    >
      {label}
    </Tag>
  );
}

function renderDate<T>(col: SdTableColumnDate<T> | SdTableColumnDatetime<T>, value: unknown): React.ReactNode {
  if (!value) return <Text type="secondary">—</Text>;
  const fmt = col.type === 'datetime'
    ? (col.format ?? 'DD/MM/YYYY HH:mm')
    : (col.format ?? 'DD/MM/YYYY');
  const d = dayjs(value as string | number | Date);
  return d.isValid() ? d.format(fmt) : <Text type="secondary">—</Text>;
}

function renderValues<T>(col: SdTableColumnValues<T>, value: unknown): React.ReactNode {
  const values = col.multiple && Array.isArray(value) ? value : [value];
  return (
    <Space size={4} wrap>
      {values.map((v, i) => {
        const opt = col.options.find((o) => o.value === v);
        if (!opt) return null;
        const hex = opt.color
          ? opt.color in SD_COLOR_MAP
            ? SD_COLOR_MAP[opt.color as SdColor]
            : opt.color
          : SD_COLOR_MAP.secondary;
        const light = opt.color
          ? opt.color in SD_COLOR_LIGHT_MAP
            ? SD_COLOR_LIGHT_MAP[opt.color as SdColor]
            : `${hex}1a`
          : SD_COLOR_LIGHT_MAP.secondary;
        return (
          <Tag key={i} style={{ backgroundColor: light, borderColor: 'transparent', color: hex }}>
            {opt.label}
          </Tag>
        );
      })}
    </Space>
  );
}

function LazyValueCell({ load, value }: { load: (v: unknown) => Promise<string>; value: unknown }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (value == null) return;
    load(value).then(setLabel);
  }, [load, value]);
  if (label == null) return <Text type="secondary">…</Text>;
  return <span>{label}</span>;
}

// ─── Column Builder ───────────────────────────────────────────────────────────

function buildAntColumn<T extends object>(
  col: SdTableColumn<T>,
): ColumnsType<T>[number] {
  const base: ColumnsType<T>[number] = {
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex ?? col.key,
    width: col.width,
    fixed: col.fixed,
    align: col.align,
    ellipsis: col.ellipsis,
    sorter: col.sortable ? true : undefined,
    onCell: (row: T) => ({
      onClick: col.onClick ? () => col.onClick!(row) : undefined,
      style: col.onClick ? { cursor: 'pointer' } : undefined,
      className: typeof col.className === 'function' ? col.className(row) : col.className,
    }),
  };

  switch (col.type) {
    case 'text':
      base.render = (v, row) => renderText(col, v, row as T);
      break;
    case 'number':
      base.render = (v, row) => renderNumber(col, v, row as T);
      break;
    case 'boolean':
      base.render = (v) => renderBoolean(col, v);
      break;
    case 'date':
    case 'datetime':
      base.render = (v) => renderDate(col, v);
      break;
    case 'values':
      base.render = (v) => renderValues(col, v);
      break;
    case 'lazy-values':
      base.render = (v) => <LazyValueCell load={(col as SdTableColumnLazyValues<T>).load} value={v} />;
      break;
    case 'custom':
      base.render = (v, row, i) => (col as SdTableColumnCustom<T>).render(v, row as T, i);
      break;
  }

  return base;
}

// ─── Command Column ───────────────────────────────────────────────────────────

function buildCommandColumn<T extends object>(
  commands: SdTableCommand<T>[],
  title?: string,
  width?: number,
  fixed?: 'left' | 'right',
): ColumnsType<T>[number] {
  return {
    key: '__commands',
    title: title ?? 'Thao tác',
    width: width ?? 120,
    fixed: fixed ?? 'right',
    align: 'center',
    render: (_: unknown, row: T) => {
      const visible = commands.filter((cmd) => {
        const h = typeof cmd.hidden === 'function' ? cmd.hidden(row) : cmd.hidden;
        return !h;
      });
      return (
        <Space size={4}>
          {visible.map((cmd) => {
            const disabled = typeof cmd.disabled === 'function' ? cmd.disabled(row) : cmd.disabled;
            const hex = cmd.color ? SD_COLOR_MAP[cmd.color] : undefined;

            const btn = (
              <Button
                key={cmd.key}
                type="text"
                size="small"
                icon={cmd.icon}
                disabled={disabled}
                style={{ color: hex }}
                onClick={cmd.confirm ? undefined : () => cmd.onClick(row)}
              >
                {cmd.label}
              </Button>
            );

            if (cmd.confirm) {
              const confirmMsg =
                typeof cmd.confirm === 'string' ? cmd.confirm : 'Bạn có chắc chắn muốn thực hiện?';
              return (
                <Popconfirm
                  key={cmd.key}
                  title={confirmMsg}
                  onConfirm={() => cmd.onClick(row)}
                  okText="Xác nhận"
                  cancelText="Huỷ"
                >
                  {btn}
                </Popconfirm>
              );
            }
            return btn;
          })}
        </Space>
      );
    },
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

function exportToCsv<T extends object>(
  data: T[],
  columns: SdTableColumn<T>[],
  fileName = 'export',
): void {
  const exportCols = columns.filter((c) => !c.hidden && c.exportable !== false);
  const headers = exportCols.map((c) => (typeof c.title === 'string' ? c.title : c.key));
  const rows = data.map((row) =>
    exportCols.map((col) => {
      const val = (row as Record<string, unknown>)[col.dataIndex ?? col.key];
      if (col.type === 'date' || col.type === 'datetime') {
        return val ? dayjs(val as string).format(col.format ?? 'DD/MM/YYYY') : '';
      }
      if (col.type === 'boolean') {
        return val ? (col.trueText ?? 'Có') : (col.falseText ?? 'Không');
      }
      if (col.type === 'values') {
        const opt = col.options.find((o) => o.value === val);
        return opt?.label ?? String(val ?? '');
      }
      return String(val ?? '');
    }),
  );

  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface SdTableProps<T extends object> {
  option: SdTableOption<T>;
}

export function SdTable<T extends object>({ option }: SdTableProps<T>): React.ReactElement {
  const defaultPageSize =
    option.pagination !== false ? (option.pagination?.pageSize ?? 20) : 20;

  const [tableData, setTableData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [sorters, setSorters] = useState<SdOrder<T>[]>(option.sort?.defaultSort ?? []);

  const fetchData = useCallback(
    async (page: number, pageSize: number, orders: SdOrder<T>[]) => {
      if (option.data.mode !== 'server') return;
      setLoading(true);
      try {
        const res = await option.data.load({
          pageNumber: page,
          pageSize,
          orders,
          filters: option.filter?.defaultFilters,
        });
        setTableData(res.items);
        setTotal(res.total);
        setPagination((prev) => ({ ...prev, total: res.total }));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [option.data, option.filter?.defaultFilters],
  );

  useEffect(() => {
    if (option.data.mode === 'server') {
      fetchData(1, defaultPageSize, sorters);
    } else {
      setTableData(option.data.data);
      setTotal(option.data.data.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option.data]);

  const handleTableChange: TableProps<T>['onChange'] = useCallback(
    (pg: TablePaginationConfig, _filters: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[]) => {
      const page = pg.current ?? 1;
      const pageSize = pg.pageSize ?? defaultPageSize;
      setPagination(pg);

      const sortArray = Array.isArray(sorter) ? sorter : [sorter];
      const newSorters: SdOrder<T>[] = sortArray
        .filter((s) => s.order)
        .map((s) => ({
          field: String(s.columnKey ?? s.field ?? ''),
          direction: s.order === 'descend' ? 'desc' : 'asc',
        }));
      setSorters(newSorters);

      if (option.data.mode === 'server') {
        fetchData(page, pageSize, newSorters);
      }
    },
    [option.data.mode, fetchData, defaultPageSize],
  );

  const columns = useMemo<ColumnsType<T>>(() => {
    const visible = option.columns.filter((c) => !c.hidden);
    const builtCols = visible.map(buildAntColumn);
    if (option.commands?.length) {
      builtCols.push(
        buildCommandColumn(
          option.commands,
          option.commandsTitle,
          option.commandsWidth,
          option.commandsFixed,
        ),
      );
    }
    return builtCols;
  }, [option.columns, option.commands, option.commandsTitle, option.commandsWidth, option.commandsFixed]);

  const antPagination: TablePaginationConfig | false =
    option.pagination === false
      ? false
      : {
          ...pagination,
          showSizeChanger: option.pagination?.showSizeChanger ?? true,
          pageSizeOptions: option.pagination?.pageSizeOptions ?? [10, 20, 50, 100],
          showTotal: option.pagination?.showTotal !== false
            ? (t, range) => `${range[0]}-${range[1]} / ${t} bản ghi`
            : undefined,
        };

  const rowSelection = option.selector
    ? {
        type: option.selector.type,
        selectedRowKeys: option.selector.selectedKeys ?? [],
        onChange: option.selector.onChange,
      }
    : undefined;

  const expandable = option.expand
    ? {
        expandedRowRender: (row: T) => option.expand!.render(row),
        rowExpandable: option.expand.rowExpandable,
        expandedRowKeys: option.expand.expandedRowKeys,
        onExpand: option.expand.onExpand,
      }
    : undefined;

  const displayData = option.data.mode === 'local' ? option.data.data : tableData;

  return (
    <div className={option.className} style={option.style}>
      {option.export?.enabled && (
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={() =>
              exportToCsv(displayData, option.columns, option.export?.fileName ?? 'export')
            }
          >
            Xuất CSV
          </Button>
        </div>
      )}
      <Table<T>
        dataSource={displayData}
        columns={columns}
        rowKey={option.rowKey as string | ((row: T) => string | number)}
        loading={option.loading ?? loading}
        pagination={antPagination}
        onChange={handleTableChange}
        rowSelection={rowSelection as TableProps<T>['rowSelection']}
        expandable={expandable}
        scroll={option.scroll}
        size={option.size ?? 'middle'}
        bordered={option.bordered}
        showHeader={option.showHeader}
        sticky={option.sticky}
        locale={{ emptyText: option.emptyText ?? 'Không có dữ liệu' }}
        rowClassName={option.rowClassName}
        onRow={(row) => ({
          onClick: option.onRowClick ? () => option.onRowClick!(row) : undefined,
          style: option.onRowClick ? { cursor: 'pointer' } : undefined,
        })}
      />
    </div>
  );
}
