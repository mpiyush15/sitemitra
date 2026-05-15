import { ReviewCard } from "@/components/blocks/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { PublicReview } from "@/types/api";

type ReviewsListProps = {
  reviews: PublicReview[];
  className?: string;
};

export function ReviewsList({ reviews, className }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Customer reviews will appear here once approved."
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
