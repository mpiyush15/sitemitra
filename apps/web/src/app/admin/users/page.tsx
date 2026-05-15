import { UsersAdminPanel } from "@/components/admin/users-admin-panel";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Users</h2>
        <p className="text-sm text-muted-foreground">All registered accounts on Site Mitra.</p>
      </div>
      <UsersAdminPanel />
    </div>
  );
}
