import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle = "No data",
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} className={className} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">{col.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
