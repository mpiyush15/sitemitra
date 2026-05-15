"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

const BANNER_WIDTH = 1080;
const BANNER_HEIGHT = 480;

type ProfileBannerUploaderProps = {
  existingUrl?: string;
  onChange?: (file: File | null) => void;
  className?: string;
};

export function ProfileBannerUploader({
  existingUrl = "",
  onChange,
  className,
}: ProfileBannerUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    onChange?.(file);
  };

  const displayUrl = previewUrl ?? existingUrl;

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
        <div className="space-y-3">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted"
            style={{ aspectRatio: `${BANNER_WIDTH} / ${BANNER_HEIGHT}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Profile banner preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-muted px-3 text-sm font-medium hover:bg-muted/80"
            >
              {displayUrl === existingUrl && !previewUrl ? "Replace banner" : "Change banner"}
            </button>
            <p className="text-xs text-muted-foreground">
              Saved as {BANNER_WIDTH}×{BANNER_HEIGHT}. Wide cover for your public profile.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No profile banner"
          description="Upload a wide cover image for the top of your public profile."
          className="p-6"
        />
      )}

      {!displayUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-11 items-center rounded-lg border border-border bg-muted px-4 text-sm font-medium hover:bg-muted/80"
        >
          Upload banner
        </button>
      ) : null}
    </div>
  );
}
