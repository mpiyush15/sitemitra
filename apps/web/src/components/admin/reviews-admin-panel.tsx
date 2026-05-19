"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  deleteAdminReview,
  fetchAdminReviews,
  moderateAdminReview,
  type AdminReviewRow,
} from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import { cn } from "@/lib/utils";

type ReviewFilter = "all" | "visible" | "hidden";

const FILTER_OPTIONS: { value: ReviewFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "visible", label: "Live" },
  { value: "hidden", label: "Hidden" },
];

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReviewsAdminPanel() {
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminReviews()
      .then(setReviews)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load reviews"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "visible") return reviews.filter((row) => row.isApproved);
    if (filter === "hidden") return reviews.filter((row) => !row.isApproved);
    return reviews;
  }, [reviews, filter]);

  async function setVisibility(id: string, isApproved: boolean) {
    setBusyId(id);
    setError("");
    try {
      await moderateAdminReview(id, isApproved);
      setReviews((rows) =>
        rows.map((row) => (row.id === id ? { ...row, isApproved } : row)),
      );
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update review");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this review permanently? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await deleteAdminReview(id);
      setReviews((rows) => rows.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not delete review");
    } finally {
      setBusyId(null);
    }
  }

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
            variant={filter === option.value ? "default" : "outline"}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
            <span className="ml-1.5 text-xs opacity-80">
              (
              {option.value === "all"
                ? reviews.length
                : option.value === "visible"
                  ? reviews.filter((r) => r.isApproved).length
                  : reviews.filter((r) => !r.isApproved).length}
              )
            </span>
          </Button>
        ))}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {reviews.length === 0
            ? "No customer reviews yet."
            : "No reviews match this filter."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => {
            const busy = busyId === review.id;
            const profileHref = review.businessSlug
              ? `/business/${review.businessSlug}`
              : null;

            return (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {profileHref ? (
                        <Link
                          href={profileHref}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {review.businessName}
                        </Link>
                      ) : (
                        review.businessName
                      )}
                      {" · "}
                      {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      review.isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {review.isApproved ? "Live on profile" : "Hidden"}
                  </span>
                </div>

                <p className="mt-2 text-accent">★ {review.rating}/5</p>
                {review.reviewText ? (
                  <p className="mt-2 text-muted-foreground">{review.reviewText}</p>
                ) : (
                  <p className="mt-2 italic text-muted-foreground">No written comment.</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {review.isApproved ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => setVisibility(review.id, false)}
                    >
                      Hide from profile
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => setVisibility(review.id, true)}
                    >
                      Show on profile
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => remove(review.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
