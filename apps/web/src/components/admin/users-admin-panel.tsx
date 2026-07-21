"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { fetchAdminUsers } from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import { ROLES } from "@/lib/constants";
import type { SafeUser } from "@/types/api";

function roleLabel(role: string) {
  if (role === ROLES.USER) return "customer";
  if (role === ROLES.BUSINESS) return "business";
  if (role === ROLES.ADMIN) return "admin";
  if (role === ROLES.SUPER_ADMIN) return "super admin";
  return role;
}

export function UsersAdminPanel() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQ, setSearchQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, []);

  const cityOptions = useMemo(() => {
    const set = new Set(users.map((u) => u.city).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (cityFilter && u.city !== cityFilter) return false;
      if (!q) return true;
      const hay = `${u.fullName} ${u.email} ${u.phone} ${u.city}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, searchQ, roleFilter, cityFilter]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="admin-users-search" className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <Input
            id="admin-users-search"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Name, email, phone, city…"
            className="h-9"
          />
        </div>
        <div>
          <label htmlFor="admin-users-role" className="mb-1 block text-xs font-medium text-muted-foreground">
            Role
          </label>
          <Select
            id="admin-users-role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9"
          >
            <option value="">All roles</option>
            <option value={ROLES.USER}>Customer</option>
            <option value={ROLES.BUSINESS}>Business</option>
            <option value={ROLES.ADMIN}>Admin</option>
            <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
          </Select>
        </div>
        <div>
          <label htmlFor="admin-users-city" className="mb-1 block text-xs font-medium text-muted-foreground">
            City
          </label>
          <Select
            id="admin-users-city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-9"
          >
            <option value="">All cities</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of{" "}
        <span className="font-semibold text-foreground">{users.length}</span> users
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <DataTable
        rows={filteredUsers}
        rowKey={(u) => u.id}
        emptyTitle={users.length === 0 ? "No users" : "No users match these filters"}
        columns={[
          { key: "name", header: "Name", cell: (u) => u.fullName },
          { key: "email", header: "Email", cell: (u) => u.email },
          { key: "phone", header: "Phone", cell: (u) => u.phone || "—" },
          { key: "city", header: "City", cell: (u) => u.city || "—" },
          { key: "role", header: "Role", cell: (u) => roleLabel(u.role) },
          { key: "plan", header: "Plan", cell: (u) => u.membershipPlan },
        ]}
      />
    </div>
  );
}
