import type { CSSProperties, ReactNode } from 'react';
import type { SdColor, SdSize } from '../../../models';

export type SdUploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';
export type SdUploadAccept = 'image/*' | 'video/*' | 'audio/*' | '.pdf' | '.xlsx' | '.xls' | '.docx' | '.doc' | '.csv' | string;

export interface SdUploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  percent?: number;
  response?: unknown;
  originFileObj?: File;
}

export interface SdUploadFileProps {
  value?: SdUploadFile[];
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number;
  accept?: SdUploadAccept | SdUploadAccept[];
  listType?: SdUploadListType;
  disabled?: boolean;
  dragAndDrop?: boolean;
  label?: string;
  hint?: ReactNode;
  color?: SdColor;
  size?: SdSize;
  className?: string;
  style?: CSSProperties;
  customRequest?: (options: SdUploadRequestOptions) => void;
  onChange?: (files: SdUploadFile[]) => void;
  onRemove?: (file: SdUploadFile) => boolean | void | Promise<boolean | void>;
  onPreview?: (file: SdUploadFile) => void;
}

export interface SdUploadRequestOptions {
  file: File;
  onProgress: (percent: number) => void;
  onSuccess: (response: unknown) => void;
  onError: (error: Error) => void;
}
