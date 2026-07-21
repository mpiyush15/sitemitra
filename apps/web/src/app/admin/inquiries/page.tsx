import { InquiriesAdminPanel } from "@/components/admin/inquiries-admin-panel";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Inquiries</h2>
        <p className="text-sm text-muted-foreground">
          Monitor all customer inquiries sent to businesses across the platform.
        </p>
      </div>
      <InquiriesAdminPanel />
    </div>
  );
}
