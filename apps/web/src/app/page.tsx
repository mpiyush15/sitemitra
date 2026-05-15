import type { Metadata } from "next";
import Link from "next/link";
import { BestServicesSection } from "@/components/blocks/best-services-section";
import { BusinessListingsSection } from "@/components/blocks/business-listings-section";
import { CategoryGrid } from "@/components/blocks/category-grid";
import { CtaSection } from "@/components/blocks/cta-section";
import { FeaturedSection } from "@/components/blocks/featured-section";
import { HeroSection } from "@/components/blocks/hero-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { HomePageSearchBridge } from "@/components/blocks/home-page-search-bridge";
import { SearchPlatformHero } from "@/components/blocks/search-platform-hero";
import { SocialReelsSection } from "@/components/blocks/social-reels-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { TopSearchesSection } from "@/components/blocks/top-searches-section";
import { VendorShowcase } from "@/components/blocks/vendor-showcase";
import { WhyChooseSection } from "@/components/blocks/why-choose-section";
import {
  HERO_CONTENT,
  HOME_TESTIMONIALS,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";
import { resolveCategories } from "@/lib/categories";
import { fetchFeaturedBusinesses, fetchBusinesses, fetchPopularSearchBlocks, fetchSocialReels, fetchTrendingSearches } from "@/lib/public";
import { buildPageTitle, getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildPageTitle(),
  description: SITE_TAGLINE,
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: getSiteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
  },
};

const sectionWrap = "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8";

export default async function HomePage() {
  const [categories, featured, listings, vendors, trending, popularBlocks, socialReels] = await Promise.all([
    resolveCategories(),
    fetchFeaturedBusinesses(8),
    fetchBusinesses({ limit: 8 }),
    fetchBusinesses({ category: "material-vendors", limit: 4 }),
    fetchTrendingSearches(8),
    fetchPopularSearchBlocks(3, 4),
    fetchSocialReels(),
  ]);

  return (
    <main className="flex-1">
      <HomePageSearchBridge />
      <HeroSection />
      <SearchPlatformHero />

      <section id="about" className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
            {HERO_CONTENT.promo}
          </p>
        </div>
      </section>

      <section className={sectionWrap}>
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Browse by category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Engineers, contractors, vendors & construction professionals
            </p>
          </div>
          <Link
            href="/listings"
            className="shrink-0 text-sm font-semibold text-accent transition-colors hover:text-accent/80 hover:underline sm:text-base"
          >
            All categories
          </Link>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className={`${sectionWrap} border-t border-border bg-muted/20`}>
        <TopSearchesSection trending={trending} />
      </section>

      <section className={sectionWrap}>
        <FeaturedSection businesses={featured} />
      </section>

      <section className={`${sectionWrap} border-t border-border`}>
        <BusinessListingsSection businesses={listings.items} />
      </section>

      <section className={`${sectionWrap} bg-muted/20`}>
        <BestServicesSection blocks={popularBlocks} />
      </section>

      <section className={sectionWrap}>
        <VendorShowcase businesses={vendors.items} />
      </section>

      <section className={`${sectionWrap} border-y border-border bg-muted/30`}>
        <HowItWorksSection />
      </section>

      <section className={sectionWrap}>
        <WhyChooseSection />
      </section>

      <section className={`${sectionWrap} bg-muted/20`}>
        <TestimonialsSection items={[...HOME_TESTIMONIALS]} />
      </section>

      <section className={`${sectionWrap} border-t border-border bg-muted/20`}>
        <SocialReelsSection reels={socialReels} />
      </section>

      <section className={sectionWrap}>
        <CtaSection />
      </section>

    </main>
  );
}
