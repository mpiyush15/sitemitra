"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/cn";

const MAX_GALLERY_IMAGES = 10;

export type GalleryUploaderValue = {
  urls: string[];
  files: File[];
};

type GalleryItem =
  | { kind: "url"; id: string; url: string }
  | { kind: "file"; id: string; file: File; previewUrl: string };

type GalleryUploaderProps = {
  existingUrls?: string[];
  maxImages?: number;
  onChange?: (value: GalleryUploaderValue) => void;
  className?: string;
};

function gridClassForCount(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-2";
  if (count <= 6) return "grid-cols-3 sm:grid-cols-3";
  return "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5";
}

export function GalleryUploader({
  existingUrls = [],
  maxImages = MAX_GALLERY_IMAGES,
  onChange,
  className,
}: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>(() =>
    existingUrls.map((url) => ({ kind: "url", id: url, url })),
  );

  const emitChange = (next: GalleryItem[]) => {
    onChange?.({
      urls: next.filter((item): item is Extract<GalleryItem, { kind: "url" }> => item.kind === "url").map((item) => item.url),
      files: next.filter((item): item is Extract<GalleryItem, { kind: "file" }> => item.kind === "file").map((item) => item.file),
    });
  };

  useEffect(() => {
    return () => {
      for (const item of items) {
        if (item.kind === "file") URL.revokeObjectURL(item.previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke on unmount only
  }, []);

  useEffect(() => {
    setItems(existingUrls.map((url) => ({ kind: "url" as const, id: url, url })));
  }, [existingUrls]);

  const totalCount = items.length;
  const canAddMore = totalCount < maxImages;
  const slotsInGrid = canAddMore ? totalCount + 1 : totalCount;
  const gridClass = gridClassForCount(slotsInGrid);

  const counterLabel = useMemo(
    () => `${totalCount} / ${maxImages} images`,
    [totalCount, maxImages],
  );

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files;
    if (!picked?.length) return;

    const room = maxImages - items.length;
    if (room <= 0) {
      e.target.value = "";
      return;
    }

    const additions: GalleryItem[] = Array.from(picked)
      .slice(0, room)
      .map((file) => ({
        kind: "file" as const,
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    const next = [...items, ...additions];
    setItems(next);
    emitChange(next);
    e.target.value = "";
  };

  const removeItem = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (target?.kind === "file") URL.revokeObjectURL(target.previewUrl);

    const next = items.filter((item) => item.id !== id);
    setItems(next);
    emitChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{counterLabel}</p>
        {!canAddMore ? (
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Maximum reached</p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="sr-only"
      />

      <div
        className={cn(
          "grid w-full gap-2",
          totalCount === 0 ? "grid-cols-1" : gridClass,
        )}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.kind === "url" ? item.url : item.previewUrl}
              alt="Gallery"
              className="h-full w-full object-cover"
            />
            {item.kind === "file" ? (
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                New
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/50 px-2 text-center transition-colors hover:border-accent hover:bg-muted",
              totalCount === 0 ? "min-h-[140px] w-full" : "",
            )}
          >
            <span className="text-lg leading-none text-muted-foreground">+</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {totalCount === 0 ? "Upload images" : "Add"}
            </span>
          </button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Up to {maxImages} images. JPG or PNG recommended.
      </p>
    </div>
  );
}
