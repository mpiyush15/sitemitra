"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAdminSocialReel,
  deleteAdminSocialReel,
  fetchAdminSocialReels,
  updateAdminSocialReel,
} from "@/lib/admin-social-reels";
import { ApiClientError } from "@/lib/api";
import { detectReelPlatform } from "@/lib/social-reel-embed";
import type { SocialReelItem, SocialReelPlatform } from "@/types/api";

const PLATFORMS: SocialReelPlatform[] = ["instagram", "youtube", "facebook"];

export function SocialReelsAdminPanel() {
  const [reels, setReels] = useState<SocialReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [platform, setPlatform] = useState<SocialReelPlatform>("instagram");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setReels(await fetchAdminSocialReels());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load reels");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function onUrlChange(value: string) {
    setSourceUrl(value);
    const detected = detectReelPlatform(value);
    if (detected) setPlatform(detected);
  }

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    const url = sourceUrl.trim();
    if (!url) return;

    setSaving(true);
    setError("");
    try {
      await createAdminSocialReel({
        title: title.trim() || undefined,
        platform,
        sourceUrl: url,
      });
      setTitle("");
      setSourceUrl("");
      setPlatform("instagram");
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to add reel");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(reel: SocialReelItem) {
    setSaving(true);
    setError("");
    try {
      await updateAdminSocialReel(reel.id, { isActive: !reel.isActive });
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to update reel");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reel: SocialReelItem) {
    if (!window.confirm("Remove this reel from the homepage?")) return;

    setSaving(true);
    setError("");
    try {
      await deleteAdminSocialReel(reel.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to delete reel");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="reel-url" className="mb-1 block text-sm font-medium text-foreground">
            Reel URL
          </label>
          <Input
            id="reel-url"
            value={sourceUrl}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://www.instagram.com/reel/..."
            required
          />
        </div>

        <div>
          <label htmlFor="reel-title" className="mb-1 block text-sm font-medium text-foreground">
            Title (optional)
          </label>
          <Input
            id="reel-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Site tour"
          />
        </div>

        <div>
          <label htmlFor="reel-platform" className="mb-1 block text-sm font-medium text-foreground">
            Platform
          </label>
          <select
            id="reel-platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value as SocialReelPlatform)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {PLATFORMS.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving || !sourceUrl.trim()}>
            Add reel
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <DataTable
        rows={reels}
        rowKey={(reel) => reel.id}
        emptyTitle={loading ? "Loading reels…" : "No reels linked yet."}
        columns={[
          { key: "title", header: "Title", cell: (row) => row.title || "—" },
          { key: "platform", header: "Platform", cell: (row) => row.platform },
          {
            key: "sourceUrl",
            header: "URL",
            cell: (row) => (
              <a
                href={row.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="max-w-[16rem] truncate text-accent hover:underline"
              >
                {row.sourceUrl}
              </a>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => (row.isActive ? "Active" : "Hidden"),
          },
          {
            key: "actions",
            header: "Actions",
            cell: (row) => (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => void toggleActive(row)}
                >
                  {row.isActive ? "Hide" : "Show"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={saving}
                  onClick={() => void handleDelete(row)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
