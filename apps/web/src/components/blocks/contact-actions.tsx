import { CallButton } from "@/components/business/call-button";
import { WhatsAppButton } from "@/components/business/whatsapp-button";
import type { BusinessInquiryDetails, SearchInquiryContext } from "@/lib/inquiry-message";
import { cn } from "@/lib/cn";

type ContactActionsProps = {
  whatsappNumber?: string;
  phoneNumber?: string;
  /** Free plan: hide WhatsApp on public profile */
  showWhatsApp?: boolean;
  business?: BusinessInquiryDetails;
  inquiryContext?: SearchInquiryContext;
  className?: string;
};

export function ContactActions({
  whatsappNumber,
  phoneNumber,
  showWhatsApp = true,
  business,
  inquiryContext,
  className,
}: ContactActionsProps) {
  const whatsappVisible = showWhatsApp && Boolean(whatsappNumber);

  if (!whatsappVisible && !phoneNumber) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Contact details not available.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {whatsappVisible ? (
        <WhatsAppButton
          phone={whatsappNumber!}
          business={business}
          inquiryContext={inquiryContext}
        />
      ) : null}
      {phoneNumber && <CallButton phone={phoneNumber} />}
    </div>
  );
}
