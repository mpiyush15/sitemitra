import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedListingCard } from "@/components/blocks/featured-listing-card";
import { ListingsGrid } from "@/components/blocks/listings-grid";
import { ListingsFilterBar } from "@/components/blocks/listings-filter-bar";
import { ListingsPagination } from "@/components/blocks/listings-pagination";
import { ListingsPageSearch } from "@/components/blocks/listings-page-search";
import { ListingsPageSearchBridge } from "@/components/blocks/listings-page-search-bar";
import { ListingsSidebar } from "@/components/blocks/listings-sidebar";
import { SearchLogger } from "@/components/blocks/search-logger";
import { resolveCategories } from "@/lib/categories";
import { resolveCities } from "@/lib/cities";
import {
  getListingsHeading,
  resolveCategoryLabel,
  type ListingsSearchFilters,
} from "@/lib/listings-search";
import { fetchBusinesses, fetchFeaturedBusinesses } from "@/lib/public";
import { buildPageTitle, slugToLabel } from "@/lib/seo";

type ListingsPageProps = {
  searchParams: Promise<{
    category?: string;
    profession?: string;
    categoryType?: string;
    city?: string;
    experience?: string;
    q?: string;
    page?: string;
    featured?: string;
  }>;
};

export async function generateMetadata({ searchParams }: ListingsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = ["Listings"];
  if (params.q) parts.unshift(`“${params.q}”`);
  if (params.category) parts.unshift(slugToLabel(params.category));
  if (params.city) parts.unshift(slugToLabel(params.city));
  return { title: buildPageTitle(...parts) };
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const categoryType =
    params.categoryType === "professional" || params.categoryType === "vendor"
      ? params.categoryType
      : undefined;

  const filters: ListingsSearchFilters = {
    category: params.category,
    profession: params.profession,
    categoryType,
    city: params.city,
    experience: params.experience,
    q: params.q,
    page,
    featured: params.featured === "1",
  };

  const [categories, cities, result] = await Promise.all([
    resolveCategories(),
    resolveCities(),
    filters.featured
      ? {
          items: await fetchFeaturedBusinesses(24),
          pagination: { page: 1, limit: 24, total: 0, totalPages: 1 },
        }
      : fetchBusinesses({
          category: params.category,
          profession: params.profession,
          categoryType,
          city: params.city,
          experience: params.experience,
          q: params.q,
          page,
        }),
  ]);

  const categoryLabel = resolveCategoryLabel(params.category, categories);
  const { title } = getListingsHeading(filters, categoryLabel);
  const cityNames = cities.map((city) => city.cityName);
  const resultCount = filters.featured ? result.items.length : result.pagination.total;

  return (
    <main className="flex-1 bg-muted/20">
      <Suspense fallback={null}>
        <SearchLogger />
      </Suspense>

      <section className="border-b border-border bg-white">
        <div className="w-full max-w-none px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div
            id="listings-page-search"
            className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8"
          >
            <div className="shrink-0 text-center lg:min-w-[10rem] lg:border-r lg:border-border lg:pr-8 lg:text-left xl:min-w-[11rem]">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl lg:text-xl">
                {title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {resultCount} {resultCount === 1 ? "listing" : "listings"}
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <ListingsPageSearch
                cities={cityNames}
                defaultQuery={params.q}
                defaultCategory={params.category ?? params.profession}
                defaultCity={params.city}
              />
            </div>
          </div>

          <ListingsFilterBar
            filters={filters}
            cities={cityNames}
            categories={categories}
          />

          <ListingsPageSearchBridge />
        </div>
      </section>

      <section className="pb-8 pt-4 sm:pb-10 sm:pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-4">
              {filters.featured ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((business) => (
                    <FeaturedListingCard key={business.id} business={business} />
                  ))}
                </div>
              ) : (
                <ListingsGrid
                  businesses={result.items}
                  searchFilters={{
                    q: params.q,
                    category: params.category,
                    city: params.city,
                  }}
                  showFeaturedBadge={filters.featured}
                  showVerifiedBadge={!filters.featured}
                />
              )}

              {!filters.featured ? (
                <ListingsPagination
                  filters={filters}
                  page={page}
                  totalPages={result.pagination.totalPages}
                />
              ) : null}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ListingsSidebar categoryLabel={categoryLabel} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
