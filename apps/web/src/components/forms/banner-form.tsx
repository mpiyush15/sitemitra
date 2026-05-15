"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { Spinner } from "@/components/ui/spinner";

type BannerFormProps = {
  onSubmit?: (data: { title: string; imageUrl: string; href: string }) => void | Promise<void>;
};

export function BannerForm({ onSubmit }: BannerFormProps) {
  const [form, setForm] = useState({ title: "", imageUrl: "", href: "" });
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
      <FormField label="Title" htmlFor="banner-title">
        <Input id="banner-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      </FormField>
      <FormField label="Image URL" htmlFor="banner-image">
        <Input id="banner-image" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} required />
      </FormField>
      <FormField label="Link URL" htmlFor="banner-href">
        <Input id="banner-href" value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} />
      </FormField>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Save banner"}
      </Button>
    </form>
  );
}
