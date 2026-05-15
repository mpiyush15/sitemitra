import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {page > 1 && (
        <Link href={hrefForPage(page - 1)}>
          <Button variant="outline" size="sm">
            Previous
          </Button>
        </Link>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={hrefForPage(page + 1)}>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </Link>
      )}
    </div>
  );
}
