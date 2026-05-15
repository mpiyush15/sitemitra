"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type SocialLinksFormValue = {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
};

type SocialLinkFieldsProps = {
  value: SocialLinksFormValue;
  onChange: (key: keyof SocialLinksFormValue, value: string) => void;
  className?: string;
};

const SOCIAL_FIELDS: Array<{
  key: keyof SocialLinksFormValue;
  label: string;
  Icon: typeof FaFacebookF;
  placeholder: string;
}> = [
  { key: "facebook", label: "Facebook", Icon: FaFacebookF, placeholder: "Facebook profile URL" },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, placeholder: "Instagram profile URL" },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn, placeholder: "LinkedIn profile URL" },
  { key: "youtube", label: "YouTube", Icon: FaYoutube, placeholder: "YouTube channel URL" },
];

export function SocialLinkFields({ value, onChange, className }: SocialLinkFieldsProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {SOCIAL_FIELDS.map(({ key, label, Icon, placeholder }) => (
        <div key={key} className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden>
            <Icon className="h-5 w-5 text-accent" />
          </span>
          <Input
            id={`pe-${key}`}
            type="url"
            value={value[key]}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            aria-label={label}
            className="pl-11"
          />
        </div>
      ))}
    </div>
  );
}
