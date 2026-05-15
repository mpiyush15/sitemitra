"use client";

import { SquareImageUploader } from "@/components/dashboard/square-image-uploader";

type LogoUploaderProps = {
  existingUrl?: string;
  onChange?: (file: File | null) => void;
  className?: string;
};

export function LogoUploader({ existingUrl = "", onChange, className }: LogoUploaderProps) {
  return (
    <SquareImageUploader
      existingUrl={existingUrl}
      onChange={onChange}
      className={className}
      emptyTitle="No logo uploaded"
      emptyDescription="Square logo shown on your public profile (400×400)."
      previewAlt="Business logo preview"
      uploadLabel="Upload logo"
      replaceLabel="Replace logo"
      hint="Saved as 400×400 (1:1). PNG or JPG."
    />
  );
}
