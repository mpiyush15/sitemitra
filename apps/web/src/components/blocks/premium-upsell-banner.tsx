import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PremiumUpsellBanner() {
  return (
    <Card className="border-accent/40 bg-accent/5">
      <CardHeader>
        <CardTitle>Upgrade to Standard</CardTitle>
        <CardDescription>
          Get verified badge, gallery, catalogues, reviews, and priority visibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/dashboard/upgrade">
          <Button>View plans</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
