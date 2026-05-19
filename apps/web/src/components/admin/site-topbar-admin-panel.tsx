"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/forms/form-field";
import {
  fetchAdminSiteTopbar,
  normalizeSocialUrlInput,
  socialUrlForForm,
  updateAdminSiteTopbar,
  type SiteTopbarSettings,
} from "@/lib/site-topbar";
import { ApiClientError } from "@/lib/api";

function toFormSettings(data: SiteTopbarSettings): SiteTopbarSettings {
  return {
    ...data,
    instagramUrl: socialUrlForForm(data.instagramUrl),
    facebookUrl: socialUrlForForm(data.facebookUrl),
    youtubeUrl: socialUrlForForm(data.youtubeUrl),
  };
}

function toApiPayload(form: SiteTopbarSettings): SiteTopbarSettings {
  return {
    ...form,
    instagramUrl: normalizeSocialUrlInput(form.instagramUrl),
    facebookUrl: normalizeSocialUrlInput(form.facebookUrl),
    youtubeUrl: normalizeSocialUrlInput(form.youtubeUrl),
  };
}

export function SiteTopbarAdminPanel() {
  const [form, setForm] = useState<SiteTopbarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAdminSiteTopbar()
      .then((data) => setForm(toFormSettings(data)))
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load top bar settings"),
      )
      .finally(() => setLoading(false));
  }, []);

  const set =
    (key: keyof SiteTopbarSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => (current ? { ...current, [key]: event.target.value } : current));
    };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await updateAdminSiteTopbar(toApiPayload(form));
      setForm(toFormSettings(saved));
      setMessage("Top bar saved. Refresh the public site to see changes.");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not save top bar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!form) {
    return <p className="text-sm text-destructive">{error || "Could not load settings."}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-accent">{message}</p> : null}

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <section className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Social links</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Left side of the orange top bar. Icons always show; leave URL blank to save as # until
              you add a real link.
            </p>
          </div>
          <FormField label="Instagram URL" htmlFor="topbar-instagram">
            <Input
              id="topbar-instagram"
              type="text"
              value={form.instagramUrl}
              onChange={set("instagramUrl")}
              placeholder="https://instagram.com/..."
              className="h-10"
            />
          </FormField>
          <FormField label="Facebook URL" htmlFor="topbar-facebook">
            <Input
              id="topbar-facebook"
              type="text"
              value={form.facebookUrl}
              onChange={set("facebookUrl")}
              placeholder="https://facebook.com/..."
              className="h-10"
            />
          </FormField>
          <FormField label="YouTube URL" htmlFor="topbar-youtube">
            <Input
              id="topbar-youtube"
              type="text"
              value={form.youtubeUrl}
              onChange={set("youtubeUrl")}
              placeholder="https://youtube.com/..."
              className="h-10"
            />
          </FormField>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Contact & call</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Email and WhatsApp on the right as icons. Call label and number appear centered on
              the bar — tap to dial.
            </p>
          </div>
          <FormField label="Email" htmlFor="topbar-email">
            <Input
              id="topbar-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="contact@sitemitra.com"
              className="h-10"
            />
          </FormField>
          <FormField label="WhatsApp number" htmlFor="topbar-whatsapp">
            <Input
              id="topbar-whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={set("whatsapp")}
              placeholder="10-digit mobile"
              className="h-10"
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Call number" htmlFor="topbar-call-phone">
              <Input
                id="topbar-call-phone"
                type="tel"
                value={form.callPhone}
                onChange={set("callPhone")}
                placeholder="10-digit mobile"
                className="h-10"
              />
            </FormField>
            <FormField label="Call button text" htmlFor="topbar-call-label">
              <Input
                id="topbar-call-label"
                value={form.callCtaLabel}
                onChange={set("callCtaLabel")}
                placeholder="Call us"
                maxLength={48}
                required
                className="h-10"
              />
            </FormField>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Changes apply site-wide after save. Refresh the homepage to preview.
        </p>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto sm:min-w-[140px]">
          {saving ? "Saving…" : "Save top bar"}
        </Button>
      </div>
    </form>
  );
}
