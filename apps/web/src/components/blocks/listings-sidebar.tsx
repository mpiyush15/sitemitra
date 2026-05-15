import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ListingsSidebarProps = {
  categoryLabel?: string;
};

export function ListingsSidebar({ categoryLabel }: ListingsSidebarProps) {
  const heading = categoryLabel
    ? `Get quotes from top ${categoryLabel.toLowerCase()} professionals`
    : "Get quotes from verified professionals";

  return (
    <aside className="space-y-4">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold leading-snug text-foreground">
            {heading}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Browse profiles, compare ratings, and contact businesses directly. Need help choosing?
            Reach out to Site Mitra.
          </p>
          <Link href="/listings?featured=1" className="block">
            <Button variant="outline" className="h-10 w-full border-sky-600 text-sky-700 hover:bg-sky-50">
              View featured listings
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border bg-gradient-to-br from-primary to-slate-800 text-primary-foreground shadow-sm">
        <CardContent className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
            For businesses
          </p>
          <h3 className="text-lg font-bold leading-snug">List your business for free</h3>
          <p className="text-sm text-primary-foreground/85">
            Reach customers searching for construction services in your city.
          </p>
          <Link href="/?auth=register-business">
            <Button className="h-10 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Free listing
            </Button>
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
