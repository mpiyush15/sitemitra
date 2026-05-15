import { AppImage } from "@/components/ui/app-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicCatalogue } from "@/types/api";

type CatalogueCardProps = {
  catalogue: PublicCatalogue;
};

export function CatalogueCard({ catalogue }: CatalogueCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{catalogue.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {catalogue.thumbnail && (
          <AppImage
            src={catalogue.thumbnail}
            alt={catalogue.title}
            width={200}
            height={140}
            className="aspect-[10/7] w-full rounded-lg object-cover"
          />
        )}
        <a
          href={catalogue.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent hover:underline"
        >
          Download catalogue →
        </a>
      </CardContent>
    </Card>
  );
}
