"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { fetchAdminReviews, moderateAdminReview, type AdminReviewRow } from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";

export function ReviewsAdminPanel() {
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminReviews()
      .then(setReviews)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load reviews"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function moderate(id: string, isApproved: boolean) {
    try {
      await moderateAdminReview(id, isApproved);
      setReviews((rows) => rows.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update review");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No pending reviews to moderate.</p>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-medium">{review.customerName}</p>
          <p className="text-accent">★ {review.rating}/5</p>
          <p className="mt-2 text-muted-foreground">{review.reviewText}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => moderate(review.id, true)}>
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => moderate(review.id, false)}>
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
