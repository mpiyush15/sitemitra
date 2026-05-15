"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import {
  getFacebookEmbedUrl,
  getInstagramEmbedUrl,
  getYoutubeEmbedUrl,
} from "@/lib/social-reel-embed";
import { cn } from "@/lib/cn";
import type { SocialReelItem } from "@/types/api";

type SocialReelsPlayerProps = {
  reels: SocialReelItem[];
  className?: string;
};

function getEmbedUrl(reel: SocialReelItem): string | null {
  if (reel.platform === "youtube") return getYoutubeEmbedUrl(reel.sourceUrl);
  if (reel.platform === "facebook") return getFacebookEmbedUrl(reel.sourceUrl);
  return getInstagramEmbedUrl(reel.sourceUrl);
}

function ReelCard({ reel }: { reel: SocialReelItem }) {
  const embedUrl = getEmbedUrl(reel);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={reel.title || `${reel.platform} reel`}
      className="pointer-events-auto h-full w-full border-0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

const arrowClass =
  "absolute top-[38%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition hover:bg-background disabled:pointer-events-none disabled:opacity-0";

export function SocialReelsPlayer({ reels, className }: SocialReelsPlayerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [reels, updateScrollState]);

  function scrollByPage(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  }

  if (reels.length === 0) return null;

  return (
    <div className={cn("relative mx-auto w-full min-w-0 max-w-full", className)}>
      <button
        type="button"
        aria-label="Scroll reels left"
        disabled={!canScrollLeft}
        onClick={() => scrollByPage("left")}
        className={cn(arrowClass, "left-1 sm:left-2")}
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Scroll reels right"
        disabled={!canScrollRight}
        onClick={() => scrollByPage("right")}
        className={cn(arrowClass, "right-1 sm:right-2")}
      >
        <HiChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        className={cn(
          "grid w-full grid-flow-col gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory sm:gap-3",
          "auto-cols-[calc((100%-0.5rem)/2)]",
          "md:auto-cols-[calc((100%-1.5rem)/3)] lg:auto-cols-[220px]",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {reels.map((reel) => (
          <article key={reel.id} data-reel-card className="min-w-0 snap-start">
            <div className="aspect-[9/16] overflow-hidden rounded-xl border border-border bg-black shadow-sm sm:rounded-2xl">
              <ReelCard reel={reel} />
            </div>
            {reel.title ? (
              <p className="mt-2 truncate text-center text-sm font-medium text-foreground">
                {reel.title}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
