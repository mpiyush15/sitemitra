"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

/** Dashboard preview size (uploads are still stored at 400×400). */
const PREVIEW_DISPLAY_PX = 128;
const STORED_SIZE_PX = 400;

type SquareImageUploaderProps = {
  existingUrl?: string;
  onChange?: (file: File | null) => void;
  className?: string;
  emptyTitle: string;
  emptyDescription: string;
  previewAlt: string;
  uploadLabel: string;
  replaceLabel: string;
  hint: string;
};

export function SquareImageUploader({
  existingUrl = "",
  onChange,
  className,
  emptyTitle,
  emptyDescription,
  previewAlt,
  uploadLabel,
  replaceLabel,
  hint,
}: SquareImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl(null);
  }, [existingUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    onChange?.(file);
  };

  const displayUrl = previewUrl ?? existingUrl;
  const isReplace = Boolean(displayUrl === existingUrl && !previewUrl && existingUrl);

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />

      {displayUrl ? (
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="relative shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
            style={{ width: PREVIEW_DISPLAY_PX, height: PREVIEW_DISPLAY_PX }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={previewAlt}
              className="h-full w-full object-cover"
              width={PREVIEW_DISPLAY_PX}
              height={PREVIEW_DISPLAY_PX}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-muted px-3 text-sm font-medium hover:bg-muted/80"
            >
              {isReplace ? replaceLabel : "Change image"}
            </button>
            <p className="text-xs text-muted-foreground">
              {hint} Stored at {STORED_SIZE_PX}×{STORED_SIZE_PX}.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} className="p-6" />
      )}

      {!displayUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-11 items-center rounded-lg border border-border bg-muted px-4 text-sm font-medium hover:bg-muted/80"
        >
          {uploadLabel}
        </button>
      ) : null}
    </div>
  );
}
