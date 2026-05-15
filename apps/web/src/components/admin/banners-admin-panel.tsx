"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import {
  createAdminBanner,
  deleteAdminBanner,
  fetchAdminBanners,
  replaceAdminBannerImage,
  updateAdminBanner,
  type AdminBannerRow,
} from "@/lib/admin-platform";
import { getProfile } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";
import { ROLES } from "@/lib/constants";

export function BannersAdminPanel() {
  const [banners, setBanners] = useState<AdminBannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<AdminBannerRow | null>(null);
  const [saving, setSaving] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const profile = await getProfile();
        if (cancelled) return;
        setIsSuperAdmin(profile.user.role === ROLES.SUPER_ADMIN);
        const rows = await fetchAdminBanners();
        if (cancelled) return;
        setBanners(rows);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiClientError ? err.message : "Failed to load banners");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onToggleActive(row: AdminBannerRow) {
    if (!isSuperAdmin) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminBanner(row.id, { isActive: !row.isActive });
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update banner");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleOverlay(row: AdminBannerRow) {
    if (!isSuperAdmin) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminBanner(row.id, { showOverlay: !row.showOverlay });
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update overlay");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: AdminBannerRow) {
    if (!isSuperAdmin) return;
    if (!window.confirm(`Delete banner “${row.title}”? This removes the image from storage.`)) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      await deleteAdminBanner(row.id);
      setBanners((prev) => prev.filter((b) => b.id !== row.id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not delete banner");
    } finally {
      setSaving(false);
    }
  }

  async function onReplaceFileSelected(file: File | null) {
    if (!file || !replaceTargetId || !isSuperAdmin) return;
    setSaving(true);
    setError("");
    try {
      const updated = await replaceAdminBannerImage(replaceTargetId, file);
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not replace image");
    } finally {
      setSaving(false);
      setReplaceTargetId(null);
    }
  }

  if (loading && banners.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isSuperAdmin ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Only <strong>Super Admin</strong> can upload or edit banners. You can view the list below.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            Upload banner
          </Button>
          <p className="text-xs text-muted-foreground">
            JPEG / PNG / WebP — images are compressed and stored on S3.
          </p>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <DataTable
        rows={banners}
        rowKey={(banner) => banner.id}
        emptyTitle="No banners"
        columns={[
          {
            key: "thumb",
            header: "Preview",
            cell: (banner) => (
              <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={banner.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ),
          },
          { key: "title", header: "Title", cell: (banner) => banner.title },
          {
            key: "link",
            header: "Link",
            cell: (banner) => (
              <span className="max-w-[140px] truncate text-muted-foreground">
                {banner.redirectUrl || "—"}
              </span>
            ),
          },
          { key: "active", header: "Active", cell: (banner) => (banner.isActive ? "Yes" : "No") },
          {
            key: "overlay",
            header: "Overlay",
            cell: (banner) => (banner.showOverlay ? "On" : "Off"),
          },
          { key: "order", header: "Order", cell: (banner) => banner.sortOrder },
          {
            key: "actions",
            header: "Actions",
            cell: (banner) =>
              isSuperAdmin ? (
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => onToggleActive(banner)}
                  >
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => onToggleOverlay(banner)}
                    title="Toggle gradient shading and text on the homepage hero"
                  >
                    {banner.showOverlay ? "Hide overlay" : "Show overlay"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => setEditRow(banner)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => {
                      setReplaceTargetId(banner.id);
                      replaceInputRef.current?.click();
                    }}
                  >
                    Replace image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    disabled={saving}
                    onClick={() => onDelete(banner)}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
          },
        ]}
      />

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          e.target.value = "";
          void onReplaceFileSelected(f);
        }}
      />

      {isSuperAdmin ? (
        <>
          <BannerCreateModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            saving={saving}
            setSaving={setSaving}
            setError={setError}
            onCreated={(row) => {
              setBanners((prev) => [row, ...prev]);
              setCreateOpen(false);
            }}
          />
          <BannerEditModal
            row={editRow}
            onClose={() => setEditRow(null)}
            saving={saving}
            setSaving={setSaving}
            setError={setError}
            onSaved={(row) => {
              setBanners((prev) => prev.map((b) => (b.id === row.id ? row : b)));
              setEditRow(null);
            }}
          />
        </>
      ) : null}
    </div>
  );
}

function BannerCreateModal({
  open,
  onClose,
  saving,
  setSaving,
  setError,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setError: (s: string) => void;
  onCreated: (row: AdminBannerRow) => void;
}) {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOverlay, setShowOverlay] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setRedirectUrl("");
      setSortOrder("0");
      setShowOverlay(true);
      setFile(null);
      setError("");
    }
  }, [open, setError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose an image file.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("redirectUrl", redirectUrl.trim());
      fd.append("sortOrder", String(Number(sortOrder) || 0));
      fd.append("showOverlay", showOverlay ? "true" : "false");
      fd.append("image", file);
      const row = await createAdminBanner(fd);
      onCreated(row);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload hero banner" className="max-w-md">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="nb-title">
            Title
          </label>
          <Input
            id="nb-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={160}
            placeholder="Shown on the hero card"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="nb-link">
            Link (optional)
          </label>
          <Input
            id="nb-link"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="/listings or https://…"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="nb-order">
            Sort order
          </label>
          <Input
            id="nb-order"
            type="number"
            min={0}
            max={9999}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span>
            Show overlay{" "}
            <span className="text-muted-foreground">(gradient + title & CTA on hero)</span>
          </span>
        </label>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="nb-file">
            Image
          </label>
          <Input
            id="nb-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <Spinner className="h-4 w-4" /> : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function BannerEditModal({
  row,
  onClose,
  saving,
  setSaving,
  setError,
  onSaved,
}: {
  row: AdminBannerRow | null;
  onClose: () => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setError: (s: string) => void;
  onSaved: (row: AdminBannerRow) => void;
}) {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (row) {
      setTitle(row.title);
      setRedirectUrl(row.redirectUrl);
      setSortOrder(String(row.sortOrder));
      setShowOverlay(row.showOverlay !== false);
      setError("");
    }
  }, [row, setError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!row) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminBanner(row.id, {
        title: title.trim(),
        redirectUrl: redirectUrl.trim(),
        sortOrder: Number(sortOrder) || 0,
        showOverlay,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={Boolean(row)} onClose={onClose} title="Edit banner" className="max-w-md">
      {row ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="eb-title">
              Title
            </label>
            <Input id="eb-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="eb-link">
              Link
            </label>
            <Input id="eb-link" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="eb-order">
              Sort order
            </label>
            <Input
              id="eb-order"
              type="number"
              min={0}
              max={9999}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span>
              Show overlay{" "}
              <span className="text-muted-foreground">(gradient + title & CTA on hero)</span>
            </span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner className="h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
