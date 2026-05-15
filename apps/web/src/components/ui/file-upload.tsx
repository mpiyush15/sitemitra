"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { useRef, useState, type ChangeEvent } from "react";

type FileUploadProps = {
  accept?: string;
  multiple?: boolean;
  label?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onChange?: (files: FileList | null) => void;
  className?: string;
};

export function FileUpload({
  accept,
  multiple,
  label = "Choose file",
  emptyTitle = "No file selected",
  emptyDescription = "Upload a file to get started.",
  onChange,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setFileNames(Array.from(files).map((f) => f.name));
    } else {
      setFileNames([]);
    }
    onChange?.(files);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-11 items-center rounded-lg border border-border bg-muted px-4 text-sm font-medium hover:bg-muted/80"
      >
        {label}
      </button>
      {fileNames.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} className="p-6" />
      ) : (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {fileNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
