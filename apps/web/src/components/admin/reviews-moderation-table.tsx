import { DataTable } from "@/components/admin/data-table";
import { RatingStars } from "@/components/ui/rating-stars";
import type { PublicReview } from "@/types/api";

type ReviewsModerationTableProps = { reviews: PublicReview[] };

export function ReviewsModerationTable({ reviews }: ReviewsModerationTableProps) {
  return (
    <DataTable
      rows={reviews}
      rowKey={(r) => r.id}
      emptyTitle="No reviews to moderate"
      columns={[
        { key: "author", header: "Customer", cell: (r) => r.customerName },
        { key: "rating", header: "Rating", cell: (r) => <RatingStars value={r.rating} /> },
        { key: "text", header: "Review", cell: (r) => r.reviewText },
        { key: "date", header: "Date", cell: (r) => new Date(r.createdAt).toLocaleDateString() },
      ]}
    />
  );
}
