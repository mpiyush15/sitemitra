import Link from "next/link";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_CONTACT, SITE_OFFICE } from "@/lib/constants";
import { telUrl, whatsappUrl } from "@/lib/public";
import { cn } from "@/lib/cn";

type ContactOfficeStripProps = {
  className?: string;
};

export function ContactOfficeStrip({ className }: ContactOfficeStripProps) {
  return (
    <section
      id="contact"
      className={cn(
        "rounded-2xl border border-border bg-muted/40 px-6 py-10 sm:px-10",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Get in touch</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Contact & office
          </h2>
          <p className="mt-2 text-muted-foreground">
            Site Mitra is headquartered in Akola, Maharashtra — connecting construction professionals
            across the region.
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <HiOutlineMapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span className="text-foreground">{SITE_OFFICE}</span>
          </li>
          <li className="flex items-start gap-3">
            <HiOutlineEnvelope className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <a href={`mailto:${SITE_CONTACT.email}`} className="hover:text-accent">
              {SITE_CONTACT.email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <HiOutlinePhone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <a href={telUrl(SITE_CONTACT.phone)} className="hover:text-accent">
              {SITE_CONTACT.phone}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <FaWhatsapp className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <a
              href={whatsappUrl(SITE_CONTACT.whatsapp, "Hello Site Mitra")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              WhatsApp us
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
