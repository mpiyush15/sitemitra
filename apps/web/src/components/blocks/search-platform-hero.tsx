"use client";

import { HeroBannerCarousel } from "@/components/blocks/hero-banner-carousel";
import { FormEvent, useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LAUNCH_CITIES, SITE_TAGLINE } from "@/lib/constants";
import { useCategories } from "@/hooks/use-categories";
import { useCyclingSearchSuggestion } from "@/hooks/use-cycling-search-suggestion";
import { useSmartListingsSearch } from "@/hooks/use-smart-listings-search";
import { CyclingSearchPlaceholder } from "@/components/layout/cycling-search-placeholder";

const QUICK_SEARCHES = [
  { label: "Contractors in Akola", category: "contractors", city: "Akola" },
  { label: "Architects", category: "architects", city: "Akola" },
  { label: "Material Vendors", category: "material-vendors", city: "Amravati" },
  { label: "Electricians", category: "electrical-contractors", city: "Akola" },
] as const;

export function SearchPlatformHero() {
  const navigateToSmartSearch = useSmartListingsSearch();
  const { categories } = useCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const { label, visible } = useCyclingSearchSuggestion(!query.trim());

  function goSearch(overrides?: { q?: string; category?: string; city?: string }) {
    navigateToSmartSearch({
      rawQuery: overrides?.q ?? query,
      category: overrides?.category ?? category,
      city: overrides?.city ?? city,
      categories,
      cities: [...LAUNCH_CITIES],
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    goSearch();
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-10">
          {/* Banner first on mobile, right on desktop */}
          <HeroBannerCarousel />

          {/* Search second on mobile, left on desktop */}
          <div className="order-2 space-y-5 text-center sm:text-left lg:order-1">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent sm:mx-0">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              Search-first platform
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-snug tracking-tight text-primary sm:text-3xl">
                What do you need for your site today?
              </h2>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:mx-0 sm:text-base">
                {SITE_TAGLINE} Search by service, category, or city — find trusted professionals
                fast.
              </p>
            </div>

            <div
              id="home-platform-search"
              className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-primary/5 sm:p-5"
            >
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="relative">
                  <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 z-20 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder=""
                    className="relative z-10 h-12 rounded-2xl border-border bg-muted/40 pl-11 text-sm sm:h-14 sm:text-base"
                    aria-label="Search for professionals"
                  />
                  <CyclingSearchPlaceholder
                    label={label}
                    visible={!query.trim() && visible}
                    className="left-11 text-sm sm:text-base"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <HiOutlineBuildingOffice2 className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-11 rounded-xl border-border bg-muted/30 pl-10 sm:h-12"
                      aria-label="Category"
                    >
                      <option value="">All categories</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="relative">
                    <HiOutlineMapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11 rounded-xl border-border bg-muted/30 pl-10 sm:h-12"
                      aria-label="City"
                    >
                      <option value="">All cities</option>
                      {LAUNCH_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:h-12 sm:text-base"
                >
                  Search professionals
                  <HiOutlineArrowRight className="h-5 w-5" />
                </Button>
              </form>

              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-left">
                  Popular searches
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {QUICK_SEARCHES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => goSearch({ category: item.category, city: item.city })}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground sm:justify-start sm:text-sm">
              <span>
                <span className="font-semibold text-primary">16+</span> categories
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span>
                <span className="font-semibold text-primary">{LAUNCH_CITIES.length}</span> cities
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
