import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: getSiteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: getSiteUrl("/listings"), changeFrequency: "daily", priority: 0.9 },
  ];
}
