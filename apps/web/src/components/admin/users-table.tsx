import { DataTable } from "@/components/admin/data-table";
import { ROLES } from "@/lib/constants";
import type { SafeUser } from "@/types/api";

function roleLabel(role: string) {
  if (role === ROLES.USER) return "customer";
  if (role === ROLES.BUSINESS) return "business";
  if (role === ROLES.ADMIN) return "admin";
  if (role === ROLES.SUPER_ADMIN) return "super admin";
  return role;
}

type UsersTableProps = { users: SafeUser[] };

export function UsersTable({ users }: UsersTableProps) {
  return (
    <DataTable
      rows={users}
      rowKey={(u) => u.id}
      emptyTitle="No users"
      columns={[
        { key: "name", header: "Name", cell: (u) => u.fullName },
        { key: "email", header: "Email", cell: (u) => u.email },
        { key: "phone", header: "Phone", cell: (u) => u.phone || "—" },
        { key: "city", header: "City", cell: (u) => u.city || "—" },
        { key: "role", header: "Role", cell: (u) => roleLabel(u.role) },
        { key: "plan", header: "Plan", cell: (u) => u.membershipPlan },
      ]}
    />
  );
}
