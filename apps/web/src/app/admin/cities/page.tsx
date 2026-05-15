import { CitiesAdminPanel } from "@/components/admin/cities-admin-panel";

export default function AdminCitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Cities</h2>
        <p className="text-sm text-muted-foreground">
          Manage launch cities shown on the homepage. Only active cities appear publicly.
        </p>
      </div>
      <CitiesAdminPanel />
    </div>
  );
}
