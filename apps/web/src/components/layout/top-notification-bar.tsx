import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { SITE_CONTACT, SITE_SOCIAL } from "@/lib/constants";

const iconLink =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-white/15 hover:opacity-90";

export function TopNotificationBar() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="flex w-full max-w-none flex-row items-center justify-between gap-2 px-3 py-0.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <a href={SITE_SOCIAL.instagram} aria-label="Instagram" className={iconLink}>
            <FaInstagram className="h-3.5 w-3.5" />
          </a>
          <a href={SITE_SOCIAL.facebook} aria-label="Facebook" className={iconLink}>
            <FaFacebookF className="h-3.5 w-3.5" />
          </a>
          <a href={SITE_SOCIAL.youtube} aria-label="YouTube" className={iconLink}>
            <FaYoutube className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <a href={`mailto:${SITE_CONTACT.email}`} aria-label={`Email ${SITE_CONTACT.email}`} className={iconLink}>
            <HiOutlineEnvelope className="h-3.5 w-3.5" />
          </a>
          <a
            href={`https://wa.me/${SITE_CONTACT.whatsapp.replace(/\D/g, "")}`}
            aria-label={`WhatsApp ${SITE_CONTACT.phone}`}
            className={iconLink}
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
