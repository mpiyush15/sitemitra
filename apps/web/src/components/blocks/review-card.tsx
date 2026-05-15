import { RatingStars } from "@/components/ui/rating-stars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicReview } from "@/types/api";

type ReviewCardProps = {
  review: PublicReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
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
