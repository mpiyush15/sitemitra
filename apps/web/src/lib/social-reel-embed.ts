import type { SocialReelPlatform } from "@/types/api";

export function detectReelPlatform(url: string): SocialReelPlatform | null {
  const value = url.toLowerCase();
  if (/instagram\.com\/(reel|p|tv)\//.test(value)) return "instagram";
  if (/youtube\.com|youtu\.be/.test(value)) return "youtube";
  if (/facebook\.com|fb\.watch/.test(value)) return "facebook";
  return null;
}

export function normalizeInstagramPermalink(url: string) {
  const trimmed = url.trim().split("?")[0].replace(/\/$/, "");
  return `${trimmed}/`;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const value = url.trim();

  const shortsMatch = value.match(/youtube\.com\/shorts\/([\w-]+)/i);
  if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  const watchMatch = value.match(/[?&]v=([\w-]+)/i);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = value.match(/youtu\.be\/([\w-]+)/i);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return null;
}

export function getInstagramEmbedUrl(url: string): string | null {
  const match = url.trim().match(/instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/i);
  if (!match?.[1]) return null;
  return `https://www.instagram.com/reel/${match[1]}/embed`;
}

export function getFacebookEmbedUrl(url: string) {
  const encoded = encodeURIComponent(url.trim());
  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=340`;
}
