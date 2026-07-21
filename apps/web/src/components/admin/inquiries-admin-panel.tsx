"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchAdminInquiries,
  type AdminInquiryRow,
} from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import { cn } from "@/lib/cn";

type InquiryFilter = "all" | "new" | "contacted" | "converted";

const FILTER_OPTIONS: { value: InquiryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
];

function formatInquiryDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function InquiriesAdminPanel() {
  const [inquiries, setInquiries] = useState<AdminInquiryRow[]>([]);
  const [filter, setFilter] = useState<InquiryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminInquiries()
      .then(setInquiries)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load inquiries"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return inquiries;
    return inquiries.filter((row) => row.status === filter.toUpperCase());
  }, [inquiries, filter]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={filter === option.value ? "primary" : "outline"}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
            <span className="ml-1.5 text-xs opacity-80">
              (
              {option.value === "all"
                ? inquiries.length
                : inquiries.filter((r) => r.status === option.value.toUpperCase()).length}
              )
            </span>
          </Button>
        ))}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {inquiries.length === 0
            ? "No inquiries yet across the platform."
            : "No inquiries match this filter."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => {
            const profileHref = inquiry.businessSlug
              ? `/business/${inquiry.businessSlug}`
              : null;

            return (
              <div
                key={inquiry.id}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{inquiry.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      Target Business:{" "}
                      {profileHref ? (
                        <Link
                          href={profileHref}
                          className="font-medium text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {inquiry.businessName}
                        </Link>
                      ) : (
                        <span className="font-medium">{inquiry.businessName}</span>
                      )}
                      {" · "}
                      {formatInquiryDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                      inquiry.status === "NEW"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : inquiry.status === "CONTACTED"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {inquiry.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm font-medium">{inquiry.phone}</p>
                    {inquiry.city && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        City: {inquiry.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Requirement</p>
                    <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">
                      {inquiry.requirement}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
