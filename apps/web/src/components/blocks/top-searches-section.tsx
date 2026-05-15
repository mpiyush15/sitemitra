import Link from "next/link";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { TOP_SEARCHES } from "@/lib/constants";
import type { PopularSearchBlock } from "@/types/api";
import { cn } from "@/lib/cn";

type TopSearchesSectionProps = {
  trending?: PopularSearchBlock[];
  className?: string;
};

export function TopSearchesSection({ trending = [], className }: TopSearchesSectionProps) {
  const items =
    trending.length > 0
      ? trending.map((item) => ({
          label: item.label,
          href: item.href.startsWith("/") ? item.href : `/listings?${item.href}`,
        }))
      : TOP_SEARCHES.map((item) => ({ label: item.label, href: item.href }));

  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Popular right now</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Top searches in your city
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground sm:mx-0">
          {trending.length > 0
            ? "Based on what homeowners and builders search on Site Mitra."
            : "Quick paths to find professionals across Akola & Amravati."}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
