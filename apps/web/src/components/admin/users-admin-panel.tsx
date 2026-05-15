"use client";

import { useEffect, useState } from "react";
import { UsersTable } from "@/components/admin/users-table";
import { Spinner } from "@/components/ui/spinner";
import { fetchAdminUsers } from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import type { SafeUser } from "@/types/api";

export function UsersAdminPanel() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  return <UsersTable users={users} />;
}
