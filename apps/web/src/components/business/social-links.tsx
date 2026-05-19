import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import {
  formatExternalUrlLabel,
  hasExternalUrl,
  normalizeExternalUrl,
} from "@/lib/external-url";
import { cn } from "@/lib/cn";

type SocialLinksProps = {
  links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  className?: string;
  /** Show text labels under icons — used on Quick Info */
  showLabels?: boolean;
};

const SOCIAL_ITEMS = [
  { key: "facebook" as const, label: "Facebook", Icon: FaFacebookF },
  { key: "instagram" as const, label: "Instagram", Icon: FaInstagram },
  { key: "linkedin" as const, label: "LinkedIn", Icon: FaLinkedinIn },
  { key: "youtube" as const, label: "YouTube", Icon: FaYoutube },
  { key: "website" as const, label: "Website", Icon: HiOutlineGlobeAlt },
] as const;

function resolveLinkItems(links: SocialLinksProps["links"]) {
  return SOCIAL_ITEMS.flatMap((item) => {
    const raw = links[item.key];
    if (!hasExternalUrl(raw)) return [];
    const href = normalizeExternalUrl(raw!);
    return [{ ...item, href, display: formatExternalUrlLabel(raw!) }];
  });
}

export function SocialLinks({ links, className, showLabels = false }: SocialLinksProps) {
  const items = resolveLinkItems(links);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        showLabels ? "grid gap-3 sm:grid-cols-2" : "flex flex-wrap gap-3",
        className,
      )}
    >
      {items.map(({ key, label, Icon, href, display }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-3 rounded-lg border border-border bg-muted/30 transition-colors hover:border-accent/40 hover:bg-accent/10",
            showLabels ? "px-3 py-2.5" : "h-10 w-10 justify-center",
          )}
          aria-label={label}
        >
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-md bg-background",
              showLabels ? "h-9 w-9" : "h-full w-full",
            )}
          >
            <Icon className="h-5 w-5 text-accent" aria-hidden />
          </span>
          {showLabels ? (
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">{label}</span>
              <span className="block truncate text-xs text-muted-foreground">{display}</span>
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
