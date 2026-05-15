export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function uniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base);
  if (!suffix) return slug;
  return `${slug}-${suffix}`;
}
