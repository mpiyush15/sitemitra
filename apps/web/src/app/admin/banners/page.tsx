import { BannersAdminPanel } from "@/components/admin/banners-admin-panel";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Banners</h2>
        <p className="text-sm text-muted-foreground">Homepage promotional banners.</p>
      </div>
      <BannersAdminPanel />
    </div>
  );
}
