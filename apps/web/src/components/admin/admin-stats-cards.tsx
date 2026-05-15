import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type AdminStat = { label: string; value: number | string };

type AdminStatsCardsProps = {
  stats?: AdminStat[];
  className?: string;
};

const DEFAULT_STATS: AdminStat[] = [
  { label: "Users", value: 0 },
  { label: "Businesses", value: 0 },
  { label: "Payments", value: 0 },
  { label: "Pending reviews", value: 0 },
];

export function AdminStatsCards({ stats = DEFAULT_STATS, className }: AdminStatsCardsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
