import { FeaturedListingCard } from "@/components/blocks/featured-listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { BusinessCard } from "@/types/api";

type FeaturedCarouselProps = {
  businesses: BusinessCard[];
  className?: string;
};

export function FeaturedCarousel({ businesses, className }: FeaturedCarouselProps) {
  if (businesses.length === 0) {
    return (
      <EmptyState
        title="No featured listings"
        description="Featured professionals will appear here once businesses upgrade."
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory", className)}>
      {businesses.map((business) => (
        <div key={business.id} className="min-w-[300px] snap-start">
          <FeaturedListingCard business={business} />
        </div>
      ))}
    </div>
  );
}
