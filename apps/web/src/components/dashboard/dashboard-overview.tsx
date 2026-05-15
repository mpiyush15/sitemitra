import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type DashboardStats = {
  profileVisitors?: number;
  enquiriesTotal?: number;
  enquiriesNew?: number;
  plan?: string;
};

type DashboardOverviewProps = {
  stats?: DashboardStats;
  className?: string;
};

export function DashboardOverview({ stats = {}, className }: DashboardOverviewProps) {
  const items = [
    { label: "Profile visitors", value: stats.profileVisitors ?? 0 },
    { label: "Enquiries received", value: stats.enquiriesTotal ?? 0 },
    { label: "New enquiries", value: stats.enquiriesNew ?? 0 },
    { label: "Current plan", value: stats.plan ?? "free" },
  ];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
