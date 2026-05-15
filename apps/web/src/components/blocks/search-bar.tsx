"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouteNavigate } from "@/hooks/use-route-navigate";

type SearchBarProps = {
  defaultCategory?: string;
  defaultCity?: string;
  defaultQuery?: string;
};

export function SearchBar({
  defaultCategory = "",
  defaultCity = "",
  defaultQuery = "",
}: SearchBarProps) {
  const navigate = useRouteNavigate();
  const [category, setCategory] = useState(defaultCategory);
  const [city, setCity] = useState(defaultCity);
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category.trim()) params.set("category", category.trim());
    if (city.trim()) params.set("city", city.trim());
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    navigate(qs ? `/listings?${qs}` : "/listings");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <Input
        placeholder="Category (e.g. contractors)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      />
      <Input
        placeholder="City (e.g. Akola)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        aria-label="City"
      />
      <Input
        placeholder="Search services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search query"
      />
      <Button type="submit" className="w-full sm:w-auto">
        Search
      </Button>
    </form>
  );
}
