import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UpgradeCTA() {
  return (
    <Card className="border-accent/40 bg-accent/5">
      <CardHeader>
        <CardTitle>Unlock Standard features</CardTitle>
        <CardDescription>Gallery, reviews, verified badge, and more visibility.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/dashboard/upgrade">
          <Button>Upgrade now</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
