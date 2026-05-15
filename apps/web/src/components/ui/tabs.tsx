"use client";

import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
};

export function Tabs({ items, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? "");

  if (items.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground", className)}>
        No tabs configured.
      </div>
    );
  }

  const current = items.find((t) => t.id === active) ?? items[0];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2 border-b border-border pb-2" role="tablist">
        {items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === current.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab.id === current.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current.content}</div>
    </div>
  );
}
