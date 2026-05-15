import { BusinessListingRow } from "@/components/blocks/business-listing-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { ListingsSearchFilters } from "@/lib/listings-search";
import { cn } from "@/lib/cn";
import type { BusinessCard } from "@/types/api";

type ListingsGridProps = {
  businesses: BusinessCard[];
  searchFilters?: Pick<ListingsSearchFilters, "q" | "category" | "city">;
  loading?: boolean;
  className?: string;
  showFeaturedBadge?: boolean;
  showVerifiedBadge?: boolean;
};

const listShellClass = "flex flex-col gap-3 sm:gap-4";

export function ListingsGrid({
  businesses,
  searchFilters,
  loading,
  className,
  showFeaturedBadge = false,
  showVerifiedBadge = true,
}: ListingsGridProps) {
  if (loading) {
    return (
      <div className={cn(listShellClass, className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4">
            <Skeleton className="h-24 w-full rounded-lg lg:h-36" />
          </div>
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <EmptyState
        title="No listings found"
        description="Try adjusting filters or check back later."
        className={className}
      />
    );
  }

  return (
    <div className={cn(listShellClass, className)}>
      {businesses.map((business) => (
        <BusinessListingRow
          key={business.id}
          business={business}
          searchFilters={searchFilters}
          showFeaturedBadge={showFeaturedBadge}
          showVerifiedBadge={showVerifiedBadge}
        />
      ))}
    </div>
  );
}
