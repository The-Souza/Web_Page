import type { ReactNode } from "react";

export interface TableColumn<T, K extends keyof T = keyof T> {
  key: K;
  label: string;
  render?: (value: T[K], row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  rowKey?: (row: T) => string | number;
}
