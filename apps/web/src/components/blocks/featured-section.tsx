import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedListingCard } from "@/components/blocks/featured-listing-card";
import type { BusinessCard } from "@/types/api";

type FeaturedSectionProps = {
  businesses: BusinessCard[];
};

export function FeaturedSection({ businesses }: FeaturedSectionProps) {
  return (
    <section className="relative overflow-hidden border-y border-primary/80 bg-primary py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
          <div className="w-full sm:w-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-soft">
              Premium picks
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Featured professionals
            </h2>
            <p className="mt-2 text-sm text-white/75 sm:text-base">
              Hand-picked Standard professionals — chosen by Site Mitra
            </p>
          </div>
          <Link href="/listings?featured=1" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              View all
            </Button>
          </Link>
        </div>

        {businesses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/25 bg-white/5 p-8 text-center text-sm text-white/70">
            Featured listings will appear when businesses join and upgrade.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {businesses.map((business) => (
              <FeaturedListingCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
