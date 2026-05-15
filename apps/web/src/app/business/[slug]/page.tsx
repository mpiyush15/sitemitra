import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BusinessProfileView } from "@/components/blocks/business-profile-view";
import { ProfileViewTracker } from "@/components/blocks/profile-view-tracker";
import { RelatedBusinessesSection } from "@/components/blocks/related-businesses-section";
import { fetchBusinessBySlug, fetchRelatedBusinesses } from "@/lib/public";
import { buildPageTitle, getSiteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await fetchBusinessBySlug(slug);
  if (!business) return { title: buildPageTitle("Business not found") };

  const title = buildPageTitle(business.businessName, business.city);
  const description =
    business.description ||
    `${business.businessName} — ${business.category} in ${business.city}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getSiteUrl(`/business/${business.slug}`),
      type: "profile",
    },
  };
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const business = await fetchBusinessBySlug(slug);
  if (!business) notFound();

  const related = await fetchRelatedBusinesses(slug, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.businessName,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.state,
    },
    aggregateRating: business.isPremium
      ? {
          "@type": "AggregateRating",
          ratingValue: business.rating,
          reviewCount: business.totalReviews,
        }
      : undefined,
    url: getSiteUrl(`/business/${business.slug}`),
  };

  return (
    <main className="flex-1 overflow-x-hidden bg-muted/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProfileViewTracker slug={slug} />
        <Suspense fallback={null}>
          <BusinessProfileView business={business} />
        </Suspense>
        <RelatedBusinessesSection
          businesses={related}
          category={business.category}
          city={business.city}
        />
      </div>
    </main>
  );
}
