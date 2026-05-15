import { CategoriesAdminPanel } from "@/components/admin/categories-admin-panel";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Categories</h2>
        <p className="text-sm text-muted-foreground">Business categories available on the platform.</p>
      </div>
      <CategoriesAdminPanel />
    </div>
  );
}
