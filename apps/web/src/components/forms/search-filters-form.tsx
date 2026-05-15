"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/forms/form-field";
import type { CategoryItem } from "@/types/api";

type SearchFiltersFormProps = {
  categories?: CategoryItem[];
  cities?: string[];
  values?: { q?: string; category?: string; city?: string };
  onChange?: (values: { q: string; category: string; city: string }) => void;
  onSubmit?: () => void;
};

export function SearchFiltersForm({
  categories = [],
  cities = [],
  values = {},
  onChange,
  onSubmit,
}: SearchFiltersFormProps) {
  const q = values.q ?? "";
  const category = values.category ?? "";
  const city = values.city ?? "";

  const update = (patch: Partial<{ q: string; category: string; city: string }>) => {
    onChange?.({ q, category, city, ...patch });
  };

  return (
    <form
      className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <FormField label="Search" htmlFor="sf-q" className="sm:col-span-2">
        <Input id="sf-q" value={q} onChange={(e) => update({ q: e.target.value })} placeholder="Name or keyword" />
      </FormField>
      <FormField label="Category" htmlFor="sf-cat">
        <Select id="sf-cat" value={category} onChange={(e) => update({ category: e.target.value })}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.categoryName}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="City" htmlFor="sf-city">
        <Select id="sf-city" value={city} onChange={(e) => update({ city: e.target.value })}>
          <option value="">All</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </FormField>
      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 sm:col-span-2 lg:col-span-4 lg:w-auto">
        Search
      </Button>
    </form>
  );
}
