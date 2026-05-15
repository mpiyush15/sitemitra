import Link from "next/link";
import { BusinessListingCard } from "@/components/blocks/business-listing-card";
import { Button } from "@/components/ui/button";
import type { PopularSearchBlock } from "@/types/api";
import { cn } from "@/lib/cn";

type BestServicesSectionProps = {
  blocks: PopularSearchBlock[];
  className?: string;
};

export function BestServicesSection({ blocks, className }: BestServicesSectionProps) {
  if (blocks.length === 0) {
    return (
      <section className={cn("space-y-4", className)}>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Near you</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Best services near you
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground sm:mx-0">
            Search on Site Mitra to populate this section with what people look for most.
          </p>
        </div>
        <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No search trends yet — browse listings or use search to build popular results here.
        </p>
      </section>
    );
  }

  return (
    <section className={cn("space-y-10", className)}>
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Near you</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Best services near you
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground sm:mx-0">
          Live picks from popular searches — businesses matching what people look for on Site Mitra.
        </p>
      </div>

      {blocks.map((block) => (
        <div key={block.href + block.label} className="space-y-4">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
            <div className="w-full sm:w-auto">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">{block.label}</h3>
              <p className="text-sm text-muted-foreground">
                {block.searchCount > 1
                  ? `${block.searchCount} searches · top matches`
                  : "Top matches for this search"}
              </p>
            </div>
            <Link href={block.href} className="shrink-0">
              <Button variant="outline" size="sm">
                View all results
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.businesses.map((business) => (
              <BusinessListingCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
