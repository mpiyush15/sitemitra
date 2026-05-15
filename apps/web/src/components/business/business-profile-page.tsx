"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiCheckBadge,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiStar,
} from "react-icons/hi2";
import { BusinessContactActions } from "@/components/blocks/business-contact-actions";
import { BusinessEnquiryCard } from "@/components/blocks/business-enquiry-card";
import { GalleryGrid } from "@/components/blocks/gallery-grid";
import { ServicesTags } from "@/components/business/services-tags";
import { SocialLinks } from "@/components/business/social-links";
import { BusinessReviewsSection } from "@/components/business/business-reviews-section";
import { ProfilePhotoMosaic } from "@/components/business/profile-photo-mosaic";
import { SaveBusinessButton } from "@/components/business/save-business-button";
import { ShareBusinessButton } from "@/components/business/share-business-button";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showPublicVerifiedBadge } from "@/lib/membership-display";
import { fetchBusinessEngagement } from "@/lib/customer";
import { getStoredToken } from "@/lib/session";
import { cn } from "@/lib/cn";
import type { BusinessDetail, PublicReview } from "@/types/api";

type TabId = "overview" | "photos" | "reviews" | "info";

type BusinessProfilePageProps = {
  business: BusinessDetail;
};

function collectPhotos(business: BusinessDetail) {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const src of [
    business.profileBanner,
    business.thumbnail,
    business.logo,
    ...business.gallery,
  ]) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    urls.push(src);
  }
  return urls;
}

export function BusinessProfilePage({ business }: BusinessProfilePageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [saved, setSaved] = useState(false);
  const [userReview, setUserReview] = useState<PublicReview | null>(null);
  const [reviews, setReviews] = useState(business.reviews);
  const [rating, setRating] = useState(business.rating);
  const [totalReviews, setTotalReviews] = useState(business.totalReviews);

  const photos = useMemo(() => collectPhotos(business), [business]);
  const showVerified = showPublicVerifiedBadge(business);
  const isPremium = business.isPremium;

  const socialLinks = useMemo(
    () => ({ ...business.socialLinks, website: business.website }),
    [business.socialLinks, business.website],
  );

  useEffect(() => {
    if (!getStoredToken()) return;
    fetchBusinessEngagement(business.slug)
      .then((data) => {
        setSaved(data.saved);
        setUserReview(data.userReview);
      })
      .catch(() => {});
  }, [business.slug]);

  const onReviewSubmitted = useCallback((review: PublicReview) => {
    setUserReview(review);
    setReviews((prev) => {
      const next = [review, ...prev.filter((r) => r.id !== review.id)];
      const sum = next.reduce((s, r) => s + r.rating, 0);
      setTotalReviews(next.length);
      setRating(Math.round((sum / next.length) * 10) / 10);
      return next;
    });
  }, []);

  const locationLine = [business.city, business.state].filter(Boolean).join(", ");
  const metaParts = [
    locationLine,
    business.experience ? `${business.experience} experience` : null,
  ].filter(Boolean);

  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>{business.description || "No description provided yet."}</p>
              {isPremium && business.services.length > 0 ? (
                <div>
                  <p className="mb-2 font-medium text-foreground">Services</p>
                  <ServicesTags services={business.services} />
                </div>
              ) : null}
            </CardContent>
          </Card>
          {!isPremium ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Gallery and full profile unlock with a verified Standard listing on Site Mitra.
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "photos",
      label: "Photos",
      content: (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {isPremium && photos.length > 0 ? (
              <GalleryGrid images={photos} placeholderCount={6} />
            ) : (
              <ProfilePhotoMosaic images={photos} businessName={business.businessName} />
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "reviews",
      label: `Reviews${totalReviews > 0 ? ` (${totalReviews})` : ""}`,
      content: (
        <BusinessReviewsSection
          slug={business.slug}
          reviews={reviews}
          rating={rating}
          totalReviews={totalReviews}
          userReview={userReview}
          onReviewSubmitted={onReviewSubmitted}
        />
      ),
    },
    {
      id: "info",
      label: "Quick Info",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {business.phoneNumber ? <p>Phone: {business.phoneNumber}</p> : null}
              {business.email ? <p>Email: {business.email}</p> : null}
              {business.whatsappNumber ? <p>WhatsApp: {business.whatsappNumber}</p> : null}
              {!business.phoneNumber && !business.email && !business.whatsappNumber ? (
                <p>Contact details not added yet.</p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <HiOutlineMapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {locationLine || "Not specified"}
              </p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Social</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialLinks links={socialLinks} />
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="min-w-0 space-y-0 pb-24 lg:pb-8">
      {/* Photo mosaic */}
      <ProfilePhotoMosaic
        images={photos}
        businessName={business.businessName}
        onSelect={() => setActiveTab("photos")}
      />

      {/* Header card */}
      <section className="-mt-1 rounded-t-2xl border border-border bg-card px-4 pb-4 pt-5 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {business.businessName}
              </h1>
              {showVerified ? <VerifiedBadge /> : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {totalReviews > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-sm font-bold text-white">
                  {rating.toFixed(1)}
                  <HiStar className="h-3.5 w-3.5 fill-white" aria-hidden />
                </span>
              ) : null}
              {totalReviews > 0 ? (
                <span className="text-sm text-muted-foreground">
                  {totalReviews} {totalReviews === 1 ? "rating" : "ratings"}
                </span>
              ) : null}
              {showVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700">
                  <HiCheckBadge className="h-4 w-4" aria-hidden />
                  Verified
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{metaParts.join(" · ")}</p>
            <Badge variant="outline" className="mt-2">
              {business.category}
            </Badge>
          </div>
          <SaveBusinessButton slug={business.slug} initialSaved={saved} variant="icon" />
        </div>

        {/* Action bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <BusinessContactActions
            whatsappNumber={business.whatsappNumber}
            phoneNumber={business.phoneNumber}
            businessName={business.businessName}
            slug={business.slug}
            category={business.category}
            city={business.city}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <HiStar className="h-4 w-4 text-amber-500" />
            Rate
          </button>
          <ShareBusinessButton
            slug={business.slug}
            businessName={business.businessName}
            category={business.category}
            city={business.city}
          />
        </div>
      </section>

      {/* Tabs + content */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <ProfileTabs items={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <aside className="hidden space-y-4 lg:block">
          <BusinessEnquiryCard
            businessSlug={business.slug}
            businessName={business.businessName}
            defaultCity={business.city}
          />
          {isPremium && business.catalogues.length > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Catalogues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {business.catalogues.map((item) => (
                  <Link
                    key={item.id}
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm font-medium text-accent hover:underline"
                  >
                    {item.title}
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          {business.phoneNumber ? (
            <a
              href={`tel:${business.phoneNumber.replace(/\s/g, "")}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white"
            >
              <HiOutlinePhone className="h-4 w-4" />
              Call
            </a>
          ) : null}
          <SaveBusinessButton slug={business.slug} initialSaved={saved} className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

function ProfileTabs({
  items,
  activeTab,
  onTabChange,
}: {
  items: { id: string; label: string; content: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: TabId) => void;
}) {
  const current = items.find((t) => t.id === activeTab) ?? items[0];

  return (
    <div className="min-w-0">
      <nav
        className="flex gap-1 overflow-x-auto border-b border-border pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Profile sections"
      >
        {items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as TabId)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab.id === current.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="mt-4 min-w-0">{current.content}</div>
    </div>
  );
}
