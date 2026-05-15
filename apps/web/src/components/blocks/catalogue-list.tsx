import { CatalogueCard } from "@/components/blocks/catalogue-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { PublicCatalogue } from "@/types/api";

type CatalogueListProps = {
  catalogues: PublicCatalogue[];
  className?: string;
};

export function CatalogueList({ catalogues, className }: CatalogueListProps) {
  if (catalogues.length === 0) {
    return (
      <EmptyState
        title="No catalogues"
        description="Downloadable catalogues are available for Standard members."
        className={className}
      />
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {catalogues.map((catalogue) => (
        <CatalogueCard key={catalogue.id} catalogue={catalogue} />
      ))}
    </div>
  );
}
