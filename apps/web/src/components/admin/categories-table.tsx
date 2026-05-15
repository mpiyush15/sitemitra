import { DataTable } from "@/components/admin/data-table";
import type { CategoryItem } from "@/types/api";

type CategoriesTableProps = { categories: CategoryItem[] };

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <DataTable
      rows={categories}
      rowKey={(c) => c.id}
      emptyTitle="No categories"
      columns={[
        { key: "icon", header: "Icon", cell: (c) => c.icon },
        { key: "name", header: "Name", cell: (c) => c.categoryName },
        { key: "slug", header: "Slug", cell: (c) => c.slug },
      ]}
    />
  );
}
