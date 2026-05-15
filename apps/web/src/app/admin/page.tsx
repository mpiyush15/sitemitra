"use client";

import { useEffect, useState } from "react";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { Spinner } from "@/components/ui/spinner";
import { fetchPlatformAnalytics } from "@/lib/analytics";
import { ApiClientError } from "@/lib/api";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([
    { label: "Profile visits", value: 0 },
    { label: "Unique visitors", value: 0 },
    { label: "Total enquiries", value: 0 },
  ]);

  useEffect(() => {
    fetchPlatformAnalytics()
      .then((data) => {
        setStats([
          { label: "Profile visits", value: data.profileVisitors },
          { label: "Unique visitors", value: data.uniqueVisitors },
          { label: "Total enquiries", value: data.enquiriesTotal },
        ]);
      })
      .catch((err) => {
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Could not load platform analytics.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Platform dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Platform-wide visitors and enquiry analytics across all businesses.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <AdminStatsCards stats={stats} className="sm:grid-cols-2 lg:grid-cols-3" />
      )}
    </div>
  );
}
