import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role?: string;
};

type TestimonialsSectionProps = {
  items: TestimonialItem[];
  className?: string;
};

export function TestimonialsSection({ items, className }: TestimonialsSectionProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No testimonials yet"
        description="Customer stories will appear here."
        className={className}
      />
    );
  }

  return (
    <section className={cn("space-y-6", className)}>
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight">What clients say</h2>
        <p className="text-muted-foreground">Trusted by homeowners and builders</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 pt-6">
              <p className="text-sm italic text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
              <p className="text-sm font-medium">{item.author}</p>
              {item.role && <p className="text-xs text-muted-foreground">{item.role}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
