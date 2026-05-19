import { SiteTopbarAdminPanel } from "@/components/admin/site-topbar-admin-panel";

export default function AdminTopbarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Top bar</h2>
        <p className="text-sm text-muted-foreground">
          Edit the orange strip above the header: social links, email, WhatsApp, and the call button
          label (click-to-call on mobile and desktop).
        </p>
      </div>
      <SiteTopbarAdminPanel />
    </div>
  );
}
