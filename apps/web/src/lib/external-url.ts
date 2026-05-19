/** Ensure external links work when users omit https:// */
export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function hasExternalUrl(url?: string | null): boolean {
  return Boolean(url?.trim());
}

export function hasAnySocialLink(links: {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}): boolean {
  return (
    hasExternalUrl(links.facebook) ||
    hasExternalUrl(links.instagram) ||
    hasExternalUrl(links.linkedin) ||
    hasExternalUrl(links.youtube) ||
    hasExternalUrl(links.website)
  );
}

/** Shorter label for display, e.g. example.com/path */
export function formatExternalUrlLabel(url: string): string {
  const normalized = normalizeExternalUrl(url);
  if (!normalized) return "";
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${host}${path}${parsed.search}`;
  } catch {
    return url.trim();
  }
}
