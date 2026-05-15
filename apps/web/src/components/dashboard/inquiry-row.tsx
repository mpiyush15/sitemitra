import { InquiryStatusBadge } from "@/components/dashboard/inquiry-status-badge";
import { cn } from "@/lib/cn";

export type InquiryRowData = {
  id: string;
  customerName: string;
  phone: string;
  city?: string;
  message: string;
  status: string;
  createdAt: string;
};

type InquiryRowProps = {
  inquiry: InquiryRowData;
  className?: string;
};

export function InquiryRow({ inquiry, className }: InquiryRowProps) {
  return (
    <tr className={cn("border-b border-border text-sm", className)}>
      <td className="px-4 py-3 font-medium">{inquiry.customerName}</td>
      <td className="px-4 py-3 text-muted-foreground">{inquiry.phone}</td>
      <td className="px-4 py-3 text-muted-foreground">{inquiry.city || "—"}</td>
      <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{inquiry.message}</td>
      <td className="px-4 py-3">
        <InquiryStatusBadge status={inquiry.status} />
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Date(inquiry.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}
