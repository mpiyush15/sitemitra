import { CallButton } from "@/components/business/call-button";
import { WhatsAppButton } from "@/components/business/whatsapp-button";
import type { BusinessInquiryDetails, SearchInquiryContext } from "@/lib/inquiry-message";
import { cn } from "@/lib/cn";

type ContactActionsProps = {
  whatsappNumber?: string;
  phoneNumber?: string;
  business?: BusinessInquiryDetails;
  inquiryContext?: SearchInquiryContext;
  className?: string;
};

export function ContactActions({
  whatsappNumber,
  phoneNumber,
  business,
  inquiryContext,
  className,
}: ContactActionsProps) {
  if (!whatsappNumber && !phoneNumber) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Contact details not available.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {whatsappNumber ? (
        <WhatsAppButton
          phone={whatsappNumber}
          business={business}
          inquiryContext={inquiryContext}
        />
      ) : null}
      {phoneNumber && <CallButton phone={phoneNumber} />}
    </div>
  );
}
