"use client";

import { FormEvent, useState } from "react";
import { useAuthModal } from "@/components/layout/auth-modal-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/ui/rating-stars";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/lib/api";
import { getProfile } from "@/lib/auth";
import { submitBusinessReview } from "@/lib/customer";
import { ROLES } from "@/lib/constants";
import { getStoredToken } from "@/lib/session";
import type { PublicReview } from "@/types/api";

type BusinessWriteReviewProps = {
  slug: string;
  existingReview?: PublicReview | null;
  onSubmitted?: (review: PublicReview) => void;
};

export function BusinessWriteReview({ slug, existingReview, onSubmitted }: BusinessWriteReviewProps) {
  const { openAuth } = useAuthModal();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [text, setText] = useState(existingReview?.reviewText ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (existingReview) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-semibold text-foreground">Your review</p>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars value={existingReview.rating} />
          <span className="text-sm text-muted-foreground">
            {new Date(existingReview.createdAt).toLocaleDateString()}
          </span>
        </div>
        {existingReview.reviewText ? (
          <p className="mt-2 text-sm text-muted-foreground">{existingReview.reviewText}</p>
        ) : null}
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!getStoredToken()) {
      openAuth("login");
      return;
    }

    if (rating < 1) {
      setError("Please select a star rating");
      return;
    }

    setLoading(true);
    try {
      const profile = await getProfile();
      if (profile.user.role !== ROLES.USER) {
        setError("Sign up as a customer to write a review");
        openAuth("register");
        return;
      }
      const review = await submitBusinessReview(slug, { rating, reviewText: text.trim() });
      onSubmitted?.(review);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <p className="text-sm font-semibold text-foreground">Start your review</p>
      <p className="mt-1 text-xs text-muted-foreground">Registered customers only</p>
      <div className="mt-3">
        <RatingStars value={rating} onChange={setRating} className="text-2xl" />
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience (optional)"
        className="mt-3 min-h-[88px]"
        maxLength={2000}
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <Button type="submit" variant="primary" size="sm" className="mt-3" disabled={loading}>
        {loading ? <Spinner className="h-4 w-4" /> : "Submit review"}
      </Button>
    </form>
  );
}
