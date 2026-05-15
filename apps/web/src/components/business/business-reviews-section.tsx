"use client";

import { useMemo, useState } from "react";
import { ReviewCard } from "@/components/blocks/review-card";
import { BusinessWriteReview } from "@/components/business/business-write-review";
import { RatingStars } from "@/components/ui/rating-stars";
import { cn } from "@/lib/cn";
import type { PublicReview } from "@/types/api";

type SortMode = "latest" | "high" | "relevant";

type BusinessReviewsSectionProps = {
  slug: string;
  reviews: PublicReview[];
  rating: number;
  totalReviews: number;
  userReview?: PublicReview | null;
  onReviewSubmitted?: (review: PublicReview) => void;
};

export function BusinessReviewsSection({
  slug,
  reviews: initialReviews,
  rating,
  totalReviews,
  userReview: initialUserReview,
  onReviewSubmitted,
}: BusinessReviewsSectionProps) {
  const [sort, setSort] = useState<SortMode>("relevant");
  const [reviews, setReviews] = useState(initialReviews);
  const [userReview, setUserReview] = useState(initialUserReview);

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === "latest") {
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    if (sort === "high") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [reviews, sort]);

  const recentTrend = useMemo(() => reviews.slice(0, 8).map((r) => r.rating), [reviews]);

  function handleSubmitted(review: PublicReview) {
    setUserReview(review);
    setReviews((prev) => [review, ...prev.filter((r) => r.id !== review.id)]);
    onReviewSubmitted?.(review);
  }

  const pillClass = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:bg-muted",
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Reviews & ratings</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-14 min-w-[3.5rem] items-center justify-center rounded-lg bg-emerald-600 px-3 text-2xl font-bold text-white">
              {totalReviews > 0 ? rating.toFixed(1) : "—"}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                {totalReviews} {totalReviews === 1 ? "Rating" : "Ratings"}
              </p>
              <p className="text-xs text-muted-foreground">From verified customers on Site Mitra</p>
            </div>
          </div>
        </div>
      </div>

      {recentTrend.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-foreground">Recent rating trend</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recentTrend.map((value, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-sm font-medium"
              >
                {value.toFixed(1)}
                <span className="text-amber-500" aria-hidden>
                  ★
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <BusinessWriteReview
        slug={slug}
        existingReview={userReview}
        onSubmitted={handleSubmitted}
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">User reviews</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={pillClass(sort === "relevant")} onClick={() => setSort("relevant")}>
              Relevant
            </button>
            <button type="button" className={pillClass(sort === "latest")} onClick={() => setSort("latest")}>
              Latest
            </button>
            <button type="button" className={pillClass(sort === "high")} onClick={() => setSort("high")}>
              High to Low
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No reviews yet. Be the first to review.
            </p>
          ) : (
            sorted.map((review) => <ReviewCard key={review.id} review={review} compact />)
          )}
        </div>
      </div>
    </div>
  );
}
