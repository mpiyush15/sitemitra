"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePhoto,
  HiOutlineXMark,
} from "react-icons/hi2";
import { cn } from "@/lib/cn";

const PLACEHOLDER_COUNT = 6;
const thumbScrollClass =
  "flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:gap-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

type GalleryGridProps = {
  images: string[];
  placeholderCount?: number;
  className?: string;
};

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

function GalleryLightbox({ images, index, onClose, onChange }: LightboxProps) {
  const total = images.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onChange(index + 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, hasPrev, hasNext, onChange, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Close gallery"
        >
          <HiOutlineXMark className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 pb-6">
        {hasPrev && (
          <button
            type="button"
            onClick={() => onChange(index - 1)}
            className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-4"
            aria-label="Previous image"
          >
            <HiOutlineChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1}`}
          className="max-h-[calc(100dvh-5rem)] max-w-full object-contain"
        />

        {hasNext && (
          <button
            type="button"
            onClick={() => onChange(index + 1)}
            className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-4"
            aria-label="Next image"
          >
            <HiOutlineChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

type GalleryPreviewProps = {
  images: string[];
  placeholderCount: number;
  onOpenFullscreen: (index: number) => void;
};

function scrollThumbInStrip(
  strip: HTMLElement,
  thumb: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) {
  const offset =
    thumb.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
  strip.scrollTo({ left: Math.max(0, offset), behavior });
}

function GalleryPreview({ images, placeholderCount, onOpenFullscreen }: GalleryPreviewProps) {
  const [selected, setSelected] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFirstScroll = useRef(true);

  const goPrev = useCallback(() => {
    setSelected((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setSelected((i) => Math.min(images.length - 1, i + 1));
  }, [images.length]);

  useEffect(() => {
    if (isFirstScroll.current) {
      isFirstScroll.current = false;
      return;
    }

    const strip = thumbStripRef.current;
    const thumb = thumbRefs.current[selected];
    if (!strip || !thumb) return;

    scrollThumbInStrip(strip, thumb, "smooth");
  }, [selected]);

  if (images.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 sm:max-h-[28rem]">
          <div className="text-center text-muted-foreground">
            <HiOutlinePhoto className="mx-auto h-10 w-10 opacity-40 sm:h-12 sm:w-12" aria-hidden />
            <p className="mt-2 text-sm font-medium">No gallery images</p>
          </div>
        </div>
        <div className={thumbScrollClass}>
          {Array.from({ length: placeholderCount }, (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
            >
              <HiOutlinePhoto className="h-4 w-4 text-muted-foreground opacity-40" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(selected, images.length - 1);
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < images.length - 1;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpenFullscreen(safeIndex)}
          className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Open full screen gallery preview"
        >
          <div className="flex aspect-[4/3] w-full max-h-[16rem] items-center justify-center p-2 sm:max-h-[22rem] md:max-h-[26rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[safeIndex]}
              alt={`Gallery preview ${safeIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </button>

        {hasPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm hover:bg-card sm:h-10 sm:w-10"
            aria-label="Previous image"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm hover:bg-card sm:h-10 sm:w-10"
            aria-label="Next image"
          >
            <HiOutlineChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="text-center text-xs font-medium text-muted-foreground sm:text-sm">
        {safeIndex + 1} / {images.length}
        <span className="mx-1">·</span>
        <span className="font-normal">Click preview for full screen</span>
      </p>

      <div className={thumbScrollClass} ref={thumbStripRef}>
        {images.map((src, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={`${src}-${index}`}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]",
                isActive
                  ? "border-accent opacity-100 ring-2 ring-accent/25"
                  : "border-border opacity-60 hover:opacity-90",
              )}
              aria-label={`Show gallery image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GalleryGrid({
  images,
  placeholderCount = PLACEHOLDER_COUNT,
  className,
}: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const hasImages = images.length > 0;

  return (
    <>
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)}>
        <GalleryPreview
          images={images}
          placeholderCount={placeholderCount}
          onOpenFullscreen={openLightbox}
        />
      </div>

      {lightboxIndex !== null && hasImages && (
        <GalleryLightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}
