"use client";

import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";
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
};

export function WhatsAppButton({
  phone,
  business,
  inquiryContext,
  className,
  variant = "primary",
}: WhatsAppButtonProps) {
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

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        variant === "primary"
          ? "bg-[#25D366] text-white hover:bg-[#1fb855]"
          : "border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10",
        className,
      )}
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden />
      WhatsApp
    </a>
  );
}
