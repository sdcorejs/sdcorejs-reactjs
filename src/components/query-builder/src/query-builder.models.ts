import type { CSSProperties } from 'react';
import type { SdOperator } from '../../../models';

export type SdQueryFieldType = 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select';

export interface SdQueryFieldOption {
  label: string;
  value: unknown;
}

export interface SdQueryField {
  key: string;
  label: string;
  type: SdQueryFieldType;
  operators?: SdOperator[];
  options?: SdQueryFieldOption[];
}

export interface SdQueryRule {
  id: string;
  field: string;
  operator: string;
  value?: unknown;
  valueTo?: unknown;
}

export interface SdQueryGroup {
  id: string;
  condition: 'AND' | 'OR';
  rules: (SdQueryRule | SdQueryGroup)[];
}

export type SdQueryValue = SdQueryGroup;

export interface SdQueryBuilderProps {
  value: SdQueryValue;
  fields: SdQueryField[];
  onChange?: (value: SdQueryValue) => void;
  maxDepth?: number;
  readOnly?: boolean;
  className?: string;
  style?: CSSProperties;
}

// ─── Default operators per field type ────────────────────────────────────────

export const SD_QUERY_OPERATORS_BY_TYPE: Record<SdQueryFieldType, SdOperator[]> = {
  text: [
    'EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN',
    'START_WITH', 'END_WITH', 'NULL', 'NOT_NULL',
  ],
  number: [
    'EQUAL', 'NOT_EQUAL', 'BETWEEN',
    'GREATER_THAN', 'GREATER_THAN_OR_EQUAL',
    'LESS_THAN', 'LESS_THAN_OR_EQUAL',
    'NULL', 'NOT_NULL',
  ],
  boolean: ['EQUAL', 'NOT_EQUAL'],
  date: [
    'EQUAL', 'NOT_EQUAL', 'BETWEEN',
    'GREATER_THAN', 'GREATER_THAN_OR_EQUAL',
    'LESS_THAN', 'LESS_THAN_OR_EQUAL',
    'NULL', 'NOT_NULL',
  ],
  datetime: [
    'EQUAL', 'NOT_EQUAL', 'BETWEEN',
    'GREATER_THAN', 'GREATER_THAN_OR_EQUAL',
    'LESS_THAN', 'LESS_THAN_OR_EQUAL',
    'NULL', 'NOT_NULL',
  ],
  select: ['EQUAL', 'NOT_EQUAL', 'NULL', 'NOT_NULL'],
};

export const SD_QUERY_NO_VALUE_OPS = new Set<string>(['NULL', 'NOT_NULL']);
export const SD_QUERY_BETWEEN_OPS = new Set<string>(['BETWEEN', 'NOT_BETWEEN']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isGroup(item: SdQueryRule | SdQueryGroup): item is SdQueryGroup {
  return 'condition' in item;
}

export function createEmptyRule(field = ''): SdQueryRule {
  return {
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    field,
    operator: '',
    value: undefined,
    valueTo: undefined,
  };
}

export function createEmptyGroup(condition: 'AND' | 'OR' = 'AND'): SdQueryGroup {
  return {
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    condition,
    rules: [],
  };
}

// ─── Immutable tree updates ───────────────────────────────────────────────────

export function updateGroupById(
  root: SdQueryGroup,
  id: string,
  updater: (g: SdQueryGroup) => SdQueryGroup,
): SdQueryGroup {
  if (root.id === id) return updater(root);
  return {
    ...root,
    rules: root.rules.map((r) => (isGroup(r) ? updateGroupById(r, id, updater) : r)),
  };
}

export function updateRuleById(
  root: SdQueryGroup,
  id: string,
  updater: (r: SdQueryRule) => SdQueryRule,
): SdQueryGroup {
  return {
    ...root,
    rules: root.rules.map((r) => {
      if (isGroup(r)) return updateRuleById(r, id, updater);
      if (r.id === id) return updater(r);
      return r;
    }),
  };
}

export function removeById(root: SdQueryGroup, id: string): SdQueryGroup {
  return {
    ...root,
    rules: root.rules
      .filter((r) => r.id !== id)
      .map((r) => (isGroup(r) ? removeById(r, id) : r)),
  };
}
