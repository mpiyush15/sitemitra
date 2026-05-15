"use client";

import { SquareImageUploader } from "@/components/dashboard/square-image-uploader";

type ThumbnailUploaderProps = {
  existingUrl?: string;
  onChange?: (file: File | null) => void;
  className?: string;
};

export function ThumbnailUploader({
  existingUrl = "",
  onChange,
  className,
}: ThumbnailUploaderProps) {
  return (
    <SquareImageUploader
      existingUrl={existingUrl}
      onChange={onChange}
      className={className}
      emptyTitle="No listing thumbnail"
      emptyDescription="Square image on browse and search listing cards (400×400)."
      previewAlt="Listing thumbnail preview"
      uploadLabel="Upload thumbnail"
      replaceLabel="Replace thumbnail"
      hint="Saved as 400×400 (1:1). Shown on listing pages."
    />
  );
}
