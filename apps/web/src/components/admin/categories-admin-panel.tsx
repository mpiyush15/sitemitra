"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminCategory, fetchAdminCategories, updateAdminCategory } from "@/lib/admin-platform";
import { ApiClientError } from "@/lib/api";
import type { CategoryItem } from "@/types/api";

export function CategoriesAdminPanel() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setCategories(await fetchAdminCategories());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    setSaving(true);
    setError("");
    try {
      await createAdminCategory({ categoryName: name, icon: icon.trim() });
      setCategoryName("");
      setIcon("");
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to add category");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category: CategoryItem) {
    setSaving(true);
    setError("");
    try {
      await updateAdminCategory(category.id, { isActive: !category.isActive });
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to update category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="admin-cat-name" className="mb-1 block text-sm font-medium text-foreground">
            Category name
          </label>
          <Input
            id="admin-cat-name"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="e.g. Lawyers"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="admin-cat-icon" className="mb-1 block text-sm font-medium text-foreground">
            Icon (emoji or class)
          </label>
          <Input
            id="admin-cat-icon"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
            placeholder="e.g. ⚖️"
          />
        </div>
        <Button type="submit" disabled={saving || !categoryName.trim()}>
          Add category
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <DataTable
        rows={categories}
        rowKey={(c) => c.id}
        emptyTitle={loading ? "Loading categories…" : "No categories"}
        columns={[
          { key: "icon", header: "Icon", cell: (c) => <span className="text-xl">{c.icon}</span> },
          { key: "name", header: "Name", cell: (c) => c.categoryName },
          { key: "slug", header: "Slug", cell: (c) => c.slug },
          {
            key: "businesses",
            header: "Businesses",
            cell: (c) => (
              <Link
                href={`/admin/businesses?category=${encodeURIComponent(c.categoryName)}`}
                className="font-medium text-primary hover:underline"
              >
                {c.businessCount ?? 0}
              </Link>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (c) => (c.isActive ? "Active" : "Hidden"),
          },
          {
            key: "actions",
            header: "Actions",
            cell: (c) => (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving}
                onClick={() => void toggleActive(c)}
              >
                {c.isActive ? "Hide" : "Show"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
