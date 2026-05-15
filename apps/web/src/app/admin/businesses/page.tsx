import { BusinessesAdminPanel } from "@/components/admin/businesses-admin-panel";

export default function AdminBusinessesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Businesses</h2>
        <p className="text-sm text-muted-foreground">
          Registered listings, plans, and platform visibility. Super Admin can deactivate listings, mark{" "}
          <span className="font-medium text-foreground">featured</span> profiles for the homepage (from this list
          only), and manage payments.
        </p>
      </div>
      <BusinessesAdminPanel />
    </div>
  );
}
