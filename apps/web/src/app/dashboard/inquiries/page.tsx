"use client";

import { useEffect, useState } from "react";
import { InquiriesTable } from "@/components/dashboard/inquiries-table";
import type { InquiryRowData } from "@/components/dashboard/inquiry-row";
import { Spinner } from "@/components/ui/spinner";
import { fetchDashboardInquiries } from "@/lib/inquiries";
import { ApiClientError } from "@/lib/api";

export default function DashboardInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchDashboardInquiries()
      .then((items) => {
        if (!active) return;
        setInquiries(
          items.map((item) => ({
            id: item.id,
            customerName: item.customerName,
            phone: item.phone,
            city: item.city,
            message: item.requirement,
            status: item.status,
            createdAt: item.createdAt,
          })),
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Could not load enquiries.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Inquiries</h2>
        <p className="text-sm text-muted-foreground">
          Enquiries from your public profile. Only you can see these leads.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <InquiriesTable inquiries={inquiries} />
      )}
    </div>
  );
}
