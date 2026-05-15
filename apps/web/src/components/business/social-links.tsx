import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
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
};

const SOCIAL_ITEMS = [
  { key: "facebook" as const, label: "Facebook", Icon: FaFacebookF },
  { key: "instagram" as const, label: "Instagram", Icon: FaInstagram },
  { key: "linkedin" as const, label: "LinkedIn", Icon: FaLinkedinIn },
  { key: "youtube" as const, label: "YouTube", Icon: FaYoutube },
  { key: "website" as const, label: "Website", Icon: HiOutlineGlobeAlt },
];

export function SocialLinks({ links, className }: SocialLinksProps) {
  const items = SOCIAL_ITEMS.filter((item) => links[item.key]);

  if (items.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>No social links.</p>;
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map(({ key, label, Icon }) => (
        <Link
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40 transition-colors hover:border-accent/40 hover:bg-accent/10"
        >
          <Icon className="h-5 w-5 text-accent" />
        </Link>
      ))}
    </div>
  );
}
