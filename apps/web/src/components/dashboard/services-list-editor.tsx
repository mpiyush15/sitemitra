"use client";

import { useState, type KeyboardEvent } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const MAX_SERVICES = 24;

type ServicesListEditorProps = {
  value: string[];
  onChange: (services: string[]) => void;
  className?: string;
};

function normalizeService(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function ServicesListEditor({ value, onChange, className }: ServicesListEditorProps) {
  const [draft, setDraft] = useState("");

  const addService = () => {
    const next = normalizeService(draft);
    if (!next) return;
    if (value.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    if (value.length >= MAX_SERVICES) return;
    onChange([...value, next]);
    setDraft("");
  };

  const removeService = (service: string) => {
    onChange(value.filter((item) => item !== service));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addService();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. RCC design, site supervision, BOQ"
          disabled={value.length >= MAX_SERVICES}
        />
        <Button type="button" variant="outline" onClick={addService} disabled={value.length >= MAX_SERVICES}>
          Add
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/30 p-3">
          {value.map((service) => (
            <Badge key={service} variant="outline" className="gap-1 pr-1">
              {service}
              <button
                type="button"
                onClick={() => removeService(service)}
                className="rounded-full p-0.5 hover:bg-muted"
                aria-label={`Remove ${service}`}
              >
                <HiOutlineXMark className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add the services your business offers. These appear on your public profile.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Press Enter or Add after each service. Up to {MAX_SERVICES} services.
      </p>
    </div>
  );
}
