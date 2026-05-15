"use client";

import { useEffect, useState } from "react";
import { CategoriesTable } from "@/components/admin/categories-table";
import { Spinner } from "@/components/ui/spinner";
import { fetchAdminCategories } from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import type { CategoryItem } from "@/types/api";

export function CategoriesAdminPanel() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load categories"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  return <CategoriesTable categories={categories} />;
}
