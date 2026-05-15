import { PlansAdminPanel } from "@/components/admin/plans-admin-panel";

export default function AdminPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Membership plans</h2>
        <p className="text-sm text-muted-foreground">
          Define Free and Standard pricing, features, and duration. Set price to ₹0 until payments
          go live.
        </p>
      </div>
      <PlansAdminPanel />
    </div>
  );
}
