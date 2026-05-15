import { InquiryRow, type InquiryRowData } from "@/components/dashboard/inquiry-row";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

type InquiriesTableProps = {
  inquiries: InquiryRowData[];
  className?: string;
};

export function InquiriesTable({ inquiries, className }: InquiriesTableProps) {
  if (inquiries.length === 0) {
    return (
      <EmptyState
        title="No inquiries yet"
        description="Leads from your profile will appear here."
        className={className}
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full text-left">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Requirement</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
