"use client";

import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useContactLoginGate } from "@/hooks/use-contact-login-gate";
import {
  buildWhatsAppInquiryMessage,
  type BusinessInquiryDetails,
  type SearchInquiryContext,
} from "@/lib/inquiry-message";
import { whatsappUrl } from "@/lib/public";
import { cn } from "@/lib/cn";

type WhatsAppButtonProps = {
  phone: string;
  business?: BusinessInquiryDetails;
  inquiryContext?: SearchInquiryContext;
  className?: string;
  variant?: "primary" | "outline";
  /** When true (default), guests are prompted to log in instead of opening WhatsApp. */
  requireLogin?: boolean;
};

export function WhatsAppButton({
  phone,
  business,
  inquiryContext,
  className,
  variant = "primary",
  requireLogin = true,
}: WhatsAppButtonProps) {
  const { ensureLoggedIn } = useContactLoginGate();

  const href = useMemo(() => {
    const message = buildWhatsAppInquiryMessage(
      {
        businessName: business?.businessName ?? "your business",
        slug: business?.slug,
        category: business?.category,
        city: business?.city,
        profileUrl: business?.profileUrl,
      },
      inquiryContext ?? {},
    );
    return whatsappUrl(phone, message);
  }, [phone, business, inquiryContext]);

  const styleClass =
    variant === "primary"
      ? "bg-[#25D366] text-white hover:bg-[#1fb855]"
      : "border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10";

  function onActivate() {
    if (requireLogin && !ensureLoggedIn()) return;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  if (requireLogin) {
    return (
      <button
        type="button"
        onClick={onActivate}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          styleClass,
          className,
        )}
      >
        <FaWhatsapp className="h-4 w-4" aria-hidden />
        WhatsApp
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        styleClass,
        className,
      )}
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden />
      WhatsApp
    </a>
  );
}
