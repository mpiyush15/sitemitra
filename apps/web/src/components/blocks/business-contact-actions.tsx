"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ContactActions } from "@/components/blocks/contact-actions";
import { readSearchInquiry, type SearchInquiryContext } from "@/lib/inquiry-message";
import { getSiteUrl } from "@/lib/seo";

type BusinessContactActionsProps = {
  whatsappNumber?: string;
  phoneNumber?: string;
  businessName?: string;
  slug?: string;
  category?: string;
  city?: string;
  className?: string;
};

export function BusinessContactActions({
  businessName,
  slug,
  category,
  city,
  ...rest
}: BusinessContactActionsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlContext = useMemo((): SearchInquiryContext => {
    return {
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      city: searchParams.get("city") ?? undefined,
    };
  }, [searchParams]);

  const [sessionContext, setSessionContext] = useState<SearchInquiryContext>({});

  useEffect(() => {
    if (!urlContext.q && !urlContext.category && !urlContext.city) {
      setSessionContext(readSearchInquiry());
    } else {
      setSessionContext({});
    }
  }, [urlContext.q, urlContext.category, urlContext.city]);

  const inquiryContext = useMemo(
    () => ({ ...sessionContext, ...urlContext }),
    [sessionContext, urlContext],
  );

  const profileUrl = useMemo(() => {
    if (!slug) return undefined;
    const path =
      pathname?.startsWith(`/business/${slug}`) || pathname === `/business/${slug}`
        ? pathname
        : `/business/${slug}`;
    const qs = searchParams.toString();
    return getSiteUrl(qs ? `${path}?${qs}` : path);
  }, [slug, pathname, searchParams]);

  const business = useMemo(
    () =>
      businessName
        ? {
            businessName,
            slug,
            category,
            city,
            profileUrl,
          }
        : undefined,
    [businessName, slug, category, city, profileUrl],
  );

  return <ContactActions {...rest} business={business} inquiryContext={inquiryContext} />;
}
