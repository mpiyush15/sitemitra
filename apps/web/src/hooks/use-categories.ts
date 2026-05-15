"use client";

import { useEffect, useState } from "react";
import { resolveCategoriesClient, type ResolvedCategory } from "@/lib/categories";

export function useCategories() {
  const [categories, setCategories] = useState<ResolvedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resolveCategoriesClient()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
