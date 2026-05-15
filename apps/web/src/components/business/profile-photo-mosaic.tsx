"use client";

import { HiOutlinePhoto } from "react-icons/hi2";
import { cn } from "@/lib/cn";

type ProfilePhotoMosaicProps = {
  images: string[];
  businessName: string;
  onSelect?: (index: number) => void;
  className?: string;
};

export function ProfilePhotoMosaic({
  images,
  businessName,
  onSelect,
  className,
}: ProfilePhotoMosaicProps) {
  const slots = images.slice(0, 5);
  const extra = Math.max(0, images.length - 5);

  if (slots.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-[16/7] items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary to-slate-800",
          className,
        )}
      >
        <div className="text-center text-primary-foreground/80">
          <HiOutlinePhoto className="mx-auto h-10 w-10 opacity-60" aria-hidden />
          <p className="mt-2 text-sm font-medium">Photos coming soon</p>
        </div>
      </div>
    );
  }

  const cellClass =
    "relative overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  function Cell({ src, index, overlay }: { src: string; index: number; overlay?: string }) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(index)}
        className={cn(cellClass, "h-full w-full")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
        {overlay ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
            {overlay}
          </span>
        ) : null}
      </button>
    );
  }

  if (slots.length === 1) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
        <Cell src={slots[0]} index={0} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid h-[200px] gap-1 overflow-hidden rounded-xl border border-border sm:h-[240px] md:h-[280px]",
        slots.length >= 5 ? "grid-cols-4 grid-rows-2" : "grid-cols-2 grid-rows-2",
        className,
      )}
    >
      <div className={cn(cellClass, slots.length >= 3 ? "col-span-2 row-span-2" : "col-span-1 row-span-2")}>
        <button type="button" onClick={() => onSelect?.(0)} className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slots[0]} alt={businessName} className="h-full w-full object-cover" />
        </button>
      </div>
      {slots.slice(1, 5).map((src, i) => {
        const index = i + 1;
        const isLast = index === 4 && extra > 0;
        return (
          <Cell
            key={`${src}-${index}`}
            src={src}
            index={index}
            overlay={isLast ? `+${extra}` : undefined}
          />
        );
      })}
    </div>
  );
}
