import { DataTable } from "@/components/admin/data-table";

export type PaymentRow = {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
};

type PaymentsTableProps = { payments: PaymentRow[] };

export function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <DataTable
      rows={payments}
      rowKey={(p) => p.id}
      emptyTitle="No payments"
      columns={[
        { key: "id", header: "ID", cell: (p) => p.id.slice(0, 8) },
        { key: "amount", header: "Amount", cell: (p) => `₹${p.amount}` },
        { key: "status", header: "Status", cell: (p) => p.status },
        { key: "date", header: "Date", cell: (p) => new Date(p.createdAt).toLocaleDateString() },
      ]}
    />
  );
}
