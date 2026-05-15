import { BusinessCardItem } from "@/components/blocks/business-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { BusinessCard } from "@/types/api";

type VendorShowcaseProps = {
  businesses: BusinessCard[];
  className?: string;
};

export function VendorShowcase({ businesses, className }: VendorShowcaseProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Materials & supply</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Trusted vendors showcase
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground sm:mx-0">
          Cement, steel, hardware, and building material suppliers on Site Mitra.
        </p>
      </div>
      {businesses.length === 0 ? (
        <EmptyState
          title="Vendor listings coming soon"
          description="Material vendors and dealers will appear here as they join the platform."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCardItem key={business.id} business={business} />
          ))}
        </div>
      )}
    </section>
  );
}
