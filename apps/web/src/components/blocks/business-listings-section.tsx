import Link from "next/link";
import { BusinessListingCard } from "@/components/blocks/business-listing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BusinessCard } from "@/types/api";

type BusinessListingsSectionProps = {
  businesses: BusinessCard[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
};

export function BusinessListingsSection({
  businesses,
  title = "Businesses on Site Mitra",
  subtitle = "Registered engineers, contractors, vendors and professionals in Akola & Amravati",
  viewAllHref = "/listings",
  className,
}: BusinessListingsSectionProps) {
  return (
    <section className={cn("space-y-8", className)}>
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
        <div className="max-w-2xl sm:mx-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Live listings</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <Link href={viewAllHref} className="shrink-0">
          <Button variant="outline">Browse all listings</Button>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <p className="text-base font-medium text-foreground">No businesses listed yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to list your construction business on Site Mitra.
          </p>
          <Link href="/?auth=register-business" className="mt-4 inline-block">
            <Button>List your business</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {businesses.map((business) => (
            <BusinessListingCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </section>
  );
}
