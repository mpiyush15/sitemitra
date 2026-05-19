"use client";

import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { SITE_CONTACT, SITE_SOCIAL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import {
  fetchSiteTopbar,
  formatTopbarPhone,
  isPlaceholderSocialUrl,
  telUrl,
  whatsappUrl,
  type SiteTopbarSettings,
} from "@/lib/site-topbar";

const iconLink =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/15 hover:opacity-90 sm:h-10 sm:w-10";

const iconSize = "h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]";

const SOCIAL_ITEMS = [
  { key: "instagramUrl" as const, label: "Instagram", Icon: FaInstagram },
  { key: "facebookUrl" as const, label: "Facebook", Icon: FaFacebookF },
  { key: "youtubeUrl" as const, label: "YouTube", Icon: FaYoutube },
];

const FALLBACK: SiteTopbarSettings = {
  instagramUrl: SITE_SOCIAL.instagram,
  facebookUrl: SITE_SOCIAL.facebook,
  youtubeUrl: SITE_SOCIAL.youtube,
  email: SITE_CONTACT.email,
  whatsapp: SITE_CONTACT.whatsapp.replace(/\D/g, "").slice(-10),
  callPhone: SITE_CONTACT.phone.replace(/\D/g, "").slice(-10),
  callCtaLabel: "Call us",
};

export function TopNotificationBar() {
  const [settings, setSettings] = useState<SiteTopbarSettings>(FALLBACK);

  useEffect(() => {
    fetchSiteTopbar()
      .then(setSettings)
      .catch(() => setSettings(FALLBACK));
  }, []);

  const showEmail = Boolean(settings.email.trim());
  const showWhatsapp = Boolean(settings.whatsapp.trim());
  const showCall = Boolean(settings.callPhone.replace(/\D/g, "").length >= 10);
  const callLabel = settings.callCtaLabel.trim() || "Call us";
  const callNumber = formatTopbarPhone(settings.callPhone);

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="grid w-full max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 px-2 py-1.5 sm:gap-x-4 sm:px-6 sm:py-2 lg:px-8">
        <div className="flex shrink-0 items-center justify-start gap-0.5 sm:gap-1.5">
          {SOCIAL_ITEMS.map(({ key, label, Icon }) => {
            const href = settings[key];
            const placeholder = isPlaceholderSocialUrl(href);

            return (
              <a
                key={key}
                href={placeholder ? "#" : href}
                aria-label={label}
                className={cn(iconLink, placeholder && "pointer-events-none opacity-95")}
                {...(!placeholder
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { "aria-disabled": true })}
                onClick={placeholder ? (event) => event.preventDefault() : undefined}
              >
                <Icon className={iconSize} />
              </a>
            );
          })}
        </div>

        <div className="flex min-w-0 items-center justify-center overflow-hidden px-0.5">
          {showCall ? (
            <a
              href={telUrl(settings.callPhone)}
              aria-label={`${callLabel} ${callNumber}`}
              className="inline-flex max-h-8 items-center gap-1 whitespace-nowrap leading-none hover:opacity-95 sm:max-h-10 sm:gap-1.5"
            >
              <HiOutlinePhone className="h-3.5 w-3.5 shrink-0 sm:h-[18px] sm:w-[18px]" aria-hidden />
              <span className="text-[10px] font-semibold sm:text-xs">{callLabel}</span>
              <span className="text-sm font-bold tracking-wide sm:text-base">{callNumber}</span>
            </a>
          ) : (
            <span className="text-xs font-semibold opacity-80">{callLabel}</span>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5">
          {showEmail ? (
            <a
              href={`mailto:${settings.email}`}
              aria-label={`Email ${settings.email}`}
              className={iconLink}
            >
              <HiOutlineEnvelope className={iconSize} />
            </a>
          ) : null}
          {showWhatsapp ? (
            <a
              href={whatsappUrl(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={iconLink}
            >
              <FaWhatsapp className={iconSize} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
