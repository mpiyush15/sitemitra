import { Badge } from "@/components/ui/badge";
import { INQUIRY_STATUS } from "@/lib/constants";

type InquiryStatusBadgeProps = { status: string };

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  const variant =
    status === INQUIRY_STATUS.CLOSED
      ? "outline"
      : status === INQUIRY_STATUS.CONTACTED
        ? "accent"
        : "success";
  return <Badge variant={variant as "outline" | "accent" | "success"}>{status}</Badge>;
}
