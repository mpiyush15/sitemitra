import Link from "next/link";
import { BusinessListingCard } from "@/components/blocks/business-listing-card";
import { Button } from "@/components/ui/button";
import type { BusinessCard } from "@/types/api";
import { cn } from "@/lib/cn";

type RelatedBusinessesSectionProps = {
  businesses: BusinessCard[];
  category: string;
  city: string;
  className?: string;
};

export function RelatedBusinessesSection({
  businesses,
  category,
  city,
  className,
}: RelatedBusinessesSectionProps) {
  if (businesses.length === 0) return null;

  const listingsHref = `/listings?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`;

  return (
    <section className={cn("mt-10 border-t border-border pt-10 sm:mt-12 sm:pt-12", className)}>
      <div className="mb-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
        <div className="w-full sm:w-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">You may also like</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-primary sm:text-2xl">
            Related services nearby
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Similar {category.toLowerCase()} professionals in {city} and nearby matches.
          </p>
        </div>
        <Link href={listingsHref} className="shrink-0">
          <Button variant="outline" size="sm">
            View all in {city}
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businesses.map((business) => (
          <BusinessListingCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}
