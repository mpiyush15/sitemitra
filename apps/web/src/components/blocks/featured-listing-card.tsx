"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineStar,
} from "react-icons/hi2";
import { getBusinessInitials, getBusinessListingImages } from "@/lib/business-images";
import { cn } from "@/lib/cn";
import type { BusinessCard } from "@/types/api";

const HOVER_CYCLE_MS = 1400;

type FeaturedListingCardProps = {
  business: BusinessCard;
  className?: string;
};

export function FeaturedListingCard({ business, className }: FeaturedListingCardProps) {
  const images = useMemo(() => getBusinessListingImages(business), [business]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useRef(false);

  const initials = getBusinessInitials(business.businessName);
  const hasImages = images.length > 0;
  const canCycle = images.length > 1;
  const showRating = business.totalReviews > 0 && business.rating > 0;

  const stopCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
    setIsHovering(false);
  }, []);

  const startCycle = useCallback(() => {
    if (!canCycle || prefersReducedMotion.current) return;
    setIsHovering(true);
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, HOVER_CYCLE_MS);
  }, [canCycle, images.length]);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg",
        className,
      )}
    >
      <Link
        href={`/business/${business.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-primary sm:aspect-square"
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
        onFocus={startCycle}
        onBlur={stopCycle}
      >
          {hasImages ? (
            <>
              {images.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={index === activeIndex ? business.businessName : ""}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out",
                    index === activeIndex
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0",
                  )}
                />
              ))}
              {canCycle ? (
                <div
                  className={cn(
                    "absolute bottom-14 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300",
                    isHovering ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                >
                  {images.map((src, index) => (
                    <span
                      key={src}
                      className={cn(
                        "h-1.5 rounded-full bg-white shadow-sm transition-all duration-300",
                        index === activeIndex ? "w-5" : "w-1.5 opacity-60",
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-slate-800">
              <span className="text-4xl font-bold tracking-tight text-white/90">{initials}</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="pointer-events-none absolute left-0 top-0 z-20 h-14 w-14 overflow-hidden sm:h-16 sm:w-16">
            <span className="absolute left-[-34px] top-[11px] flex w-[130px] items-center justify-center gap-1 bg-accent py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:left-[-36px] sm:top-[13px] sm:py-1.5 sm:text-[11px] -rotate-45">
              <HiOutlineSparkles className="h-3 w-3 shrink-0" aria-hidden />
              Featured
            </span>
          </div>

          <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
            {business.category}
          </span>

          {canCycle && !isHovering ? (
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
              +{images.length - 1} photos
            </span>
          ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <Link
            href={`/business/${business.slug}`}
            className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
          >
            {business.businessName}
          </Link>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <HiOutlineMapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {business.city}
          </p>
        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {business.description || "Trusted construction professional on Site Mitra."}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          {showRating ? (
            <p className="flex items-center gap-1 text-sm font-medium text-foreground">
              <HiOutlineStar className="h-4 w-4 text-amber-500" aria-hidden />
              {business.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">({business.totalReviews})</span>
            </p>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              View profile
            </span>
          )}
          <Link
            href={`/business/${business.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
          >
            Details
            <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
