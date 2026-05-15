"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { fetchPublicHeroBanners, type PublicHeroBanner } from "@/lib/public-banners";
import { cn } from "@/lib/cn";

const FALLBACK_SLIDE: PublicHeroBanner = {
  id: "fallback",
  title: "Grow your visibility in Akola & Amravati",
  imageUrl:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  redirectUrl: "/?auth=register-business",
  showOverlay: true,
};

const SLIDE_INTERVAL_MS = 5200;

const fadeEase = "duration-[900ms] ease-in-out motion-reduce:duration-0";

function SlideLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function HeroBannerCarousel() {
  const [slides, setSlides] = useState<PublicHeroBanner[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPublicHeroBanners()
      .then((rows) => {
        if (!cancelled) {
          setSlides(
            rows
              .filter((r) => r.imageUrl)
              .map((r) => ({ ...r, showOverlay: r.showOverlay !== false })),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const effective = slides.length > 0 ? slides : [FALLBACK_SLIDE];
  const activeIndex = Math.min(index, effective.length - 1);
  const activeSlide = effective[activeIndex] ?? FALLBACK_SLIDE;

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (effective.length <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % effective.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [effective.length]);

  const href = activeSlide.redirectUrl?.trim() || "/?auth=register-business";

  return (
    <SlideLink
      href={href}
      className={cn(
        "relative order-1 block min-h-[200px] overflow-hidden rounded-2xl border border-border shadow-lg sm:min-h-[240px] lg:order-2 lg:min-h-[420px] lg:rounded-3xl",
        loadFailed && slides.length === 0 && "ring-1 ring-amber-200/80",
      )}
    >
      {effective.map((slide, i) => {
        const isActive = i === activeIndex;
        const showOverlay = slide.showOverlay !== false;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity",
              fadeEase,
              isActive ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
          >
            <Image
              src={slide.imageUrl}
              alt={isActive ? slide.title : ""}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority={i === 0}
            />
            {showOverlay ? (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/25" />
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6 lg:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-accent-soft sm:text-xs">
                    For businesses
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold leading-tight sm:text-xl lg:mt-2 lg:text-2xl">
                    {slide.title}
                  </h3>
                  <p className="mt-1.5 hidden text-sm text-white/85 sm:block lg:mt-2">
                    Join Site Mitra free. Upgrade to Standard for priority listing, gallery & leads.
                  </p>
                  <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm lg:mt-5">
                    List Your Business
                    <HiOutlineArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </>
            ) : null}
          </div>
        );
      })}

      {effective.length > 1 ? (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
          {effective.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 ease-in-out motion-reduce:transition-none",
                i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50",
              )}
              aria-hidden
            />
          ))}
        </div>
      ) : null}
    </SlideLink>
  );
}
