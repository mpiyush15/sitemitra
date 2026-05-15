import { DataTable } from "@/components/admin/data-table";
import { PlanBadge } from "@/components/ui/plan-badge";
import type { BusinessCard } from "@/types/api";

type BusinessesTableProps = { businesses: BusinessCard[] };

export function BusinessesTable({ businesses }: BusinessesTableProps) {
  return (
    <DataTable
      rows={businesses}
      rowKey={(b) => b.id}
      emptyTitle="No businesses"
      columns={[
        { key: "name", header: "Business", cell: (b) => b.businessName },
        { key: "category", header: "Category", cell: (b) => b.category },
        { key: "city", header: "City", cell: (b) => b.city },
        { key: "plan", header: "Plan", cell: (b) => <PlanBadge plan={b.membershipType} /> },
      ]}
    />
  );
}
