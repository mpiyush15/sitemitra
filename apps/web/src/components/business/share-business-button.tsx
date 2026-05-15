"use client";

import { useCallback, useState } from "react";
import { HiOutlineShare } from "react-icons/hi2";
import { getBusinessProfileShareUrl } from "@/lib/seo";
import { cn } from "@/lib/cn";

type ShareBusinessButtonProps = {
  slug: string;
  businessName: string;
  category?: string;
  city?: string;
  className?: string;
};

function buildSharePayload(slug: string, businessName: string, category?: string, city?: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const url = getBusinessProfileShareUrl(slug, origin);
  const location = [category, city].filter(Boolean).join(" · ");
  const text = location
    ? `Check out ${businessName} (${location}) on Site Mitra`
    : `Check out ${businessName} on Site Mitra`;

  return { url, title: `${businessName} | Site Mitra`, text };
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallback below */
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function ShareBusinessButton({
  slug,
  businessName,
  category,
  city,
  className,
}: ShareBusinessButtonProps) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "shared" | "error">("idle");

  const onShare = useCallback(async () => {
    const { url, title, text } = buildSharePayload(slug, businessName, category, city);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        setFeedback("shared");
        window.setTimeout(() => setFeedback("idle"), 2000);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    const copied = await copyToClipboard(url);
    setFeedback(copied ? "copied" : "error");
    window.setTimeout(() => setFeedback("idle"), 2500);
  }, [slug, businessName, category, city]);

  const label =
    feedback === "copied"
      ? "Link copied"
      : feedback === "shared"
        ? "Shared"
        : feedback === "error"
          ? "Could not copy"
          : "Share";

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted",
        feedback === "copied" || feedback === "shared"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800"
          : feedback === "error"
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : "",
        className,
      )}
      aria-label={label}
      title={label}
    >
      <HiOutlineShare className="h-5 w-5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
