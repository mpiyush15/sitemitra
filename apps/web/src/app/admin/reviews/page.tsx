import { ReviewsAdminPanel } from "@/components/admin/reviews-admin-panel";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          All customer reviews appear here. Hide reviews from public profiles or delete them
          permanently.
        </p>
      </div>
      <ReviewsAdminPanel />
    </div>
  );
}
