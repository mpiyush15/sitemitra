import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildListingsSearchUrl, type ListingsSearchFilters } from "@/lib/listings-search";

type ListingsPaginationProps = {
  filters: ListingsSearchFilters;
  page: number;
  totalPages: number;
};

export function ListingsPagination({ filters, page, totalPages }: ListingsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={buildListingsSearchUrl({ ...filters, page: page - 1 })}>
          <Button variant="outline" size="sm">
            Previous
          </Button>
        </Link>
      ) : null}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildListingsSearchUrl({ ...filters, page: page + 1 })}>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
