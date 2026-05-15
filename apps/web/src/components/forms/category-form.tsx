"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";
import type { CategoryItem } from "@/types/api";

type CategoryFormProps = {
  initial?: Partial<CategoryItem>;
  onSubmit?: (data: Partial<CategoryItem>) => void | Promise<void>;
};

export function CategoryForm({ initial = {}, onSubmit }: CategoryFormProps) {
  const [form, setForm] = useState({
    categoryName: initial.categoryName ?? "",
    slug: initial.slug ?? "",
    icon: initial.icon ?? "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Name" htmlFor="cat-name">
        <Input id="cat-name" value={form.categoryName} onChange={(e) => setForm((f) => ({ ...f, categoryName: e.target.value }))} required />
      </FormField>
      <FormField label="Slug" htmlFor="cat-slug">
        <Input id="cat-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
      </FormField>
      <FormField label="Icon" htmlFor="cat-icon">
        <Input id="cat-icon" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
      </FormField>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Save category"}
      </Button>
    </form>
  );
}
