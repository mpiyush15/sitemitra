import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { HiOutlineEnvelope, HiOutlineMapPin } from "react-icons/hi2";
import {
  CLIENT_CATEGORIES,
  LAUNCH_CITIES,
  MAIN_NAV,
  SITE_CONTACT,
  SITE_NAME,
  SITE_OFFICE,
  SITE_SOCIAL,
  SITE_TAGLINE,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="mt-auto border-t border-border bg-primary pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] text-primary-foreground lg:pb-0"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <p className="text-lg font-bold tracking-wide">{SITE_NAME.toUpperCase()}</p>
          <p className="text-sm text-primary-foreground/80">{SITE_TAGLINE}</p>
          <p className="text-sm text-primary-foreground/70">
            Construction networking & business listing for trusted professionals across Maharashtra.
          </p>
          <div className="flex gap-3 pt-1">
            <a href={SITE_SOCIAL.instagram} aria-label="Instagram" className="hover:text-accent-soft">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href={SITE_SOCIAL.facebook} aria-label="Facebook" className="hover:text-accent-soft">
              <FaFacebookF className="h-6 w-6" />
            </a>
            <a href={SITE_SOCIAL.youtube} aria-label="YouTube" className="hover:text-accent-soft">
              <FaYoutube className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider">Quick links</p>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {MAIN_NAV.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider">Categories</p>
          <ul className="grid grid-cols-1 gap-2 text-sm text-primary-foreground/80 sm:grid-cols-2 lg:grid-cols-1">
            {CLIENT_CATEGORIES.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/listings/${cat.slug}`} className="hover:text-white">
                  {cat.categoryName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider">Contact</p>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <HiOutlineMapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{SITE_OFFICE}</span>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineEnvelope className="h-5 w-5 shrink-0" />
              <a href={`mailto:${SITE_CONTACT.email}`} className="hover:text-white">
                {SITE_CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaWhatsapp className="h-5 w-5 shrink-0" />
              <a
                href={`https://wa.me/${SITE_CONTACT.whatsapp.replace(/\D/g, "")}`}
                className="hover:text-white"
              >
                {SITE_CONTACT.phone}
              </a>
            </li>
          </ul>
          <p className="text-xs text-primary-foreground/60">
            Serving {LAUNCH_CITIES.join(" · ")}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-primary-foreground/60 sm:px-6 lg:px-8">
          <p className="leading-relaxed">
            <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
            <span className="mx-2 text-primary-foreground/40" aria-hidden>
              ·
            </span>
            <span className="text-primary-foreground/70">Terms & conditions</span>
            <span className="mx-2 text-primary-foreground/40" aria-hidden>
              ·
            </span>
            <span className="text-primary-foreground/70">Privacy policy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
