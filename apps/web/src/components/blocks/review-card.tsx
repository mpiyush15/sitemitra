import { RatingStars } from "@/components/ui/rating-stars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicReview } from "@/types/api";

type ReviewCardProps = {
  review: PublicReview;
  compact?: boolean;
};

export function ReviewCard({ review, compact = false }: ReviewCardProps) {
  if (compact) {
    return (
      <article className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground">{review.customerName}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <RatingStars value={review.rating} />
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        {review.reviewText ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.reviewText}</p>
        ) : null}
      </article>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-base">{review.customerName}</CardTitle>
        <RatingStars value={review.rating} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{review.reviewText}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
