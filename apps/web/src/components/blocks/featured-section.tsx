import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BusinessListingCard } from "@/components/blocks/business-listing-card";
import type { BusinessCard } from "@/types/api";

type FeaturedSectionProps = {
  businesses: BusinessCard[];
};

export function FeaturedSection({ businesses }: FeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
        <div className="w-full sm:w-auto">
          <h2 className="text-2xl font-bold tracking-tight">Featured professionals</h2>
          <p className="text-muted-foreground">
            Hand-picked Standard professionals — chosen by Site Mitra
          </p>
        </div>
        <Link href="/listings?featured=1" className="shrink-0">
          <Button variant="outline" size="sm">
            View all
          </Button>
        </Link>
      </div>
      {businesses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Featured listings will appear when businesses join and upgrade.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((business) => (
            <BusinessListingCard
              key={business.id}
              business={business}
              showFeaturedBadge
              showVerifiedBadge={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
