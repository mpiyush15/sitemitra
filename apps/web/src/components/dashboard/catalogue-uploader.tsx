"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/cn";

type CatalogueUploaderProps = {
  onChange?: (files: FileList | null) => void;
  className?: string;
};

export function CatalogueUploader({ onChange, className }: CatalogueUploaderProps) {
  return (
    <FileUpload
      accept="image/*,application/pdf"
      multiple
      label="Upload catalogues"
      emptyTitle="No catalogues"
      emptyDescription="Upload PDF or image catalogues for download."
      onChange={onChange}
      className={className}
    />
  );
}
