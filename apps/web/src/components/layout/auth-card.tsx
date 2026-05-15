import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-bold tracking-wide text-primary">
            {SITE_NAME.toUpperCase()}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{SITE_TAGLINE}</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
