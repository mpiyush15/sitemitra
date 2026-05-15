"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminCity, fetchAdminCities, updateAdminCity } from "@/lib/admin-cities";
import { ApiClientError } from "@/lib/api";
import type { CityItem } from "@/types/api";

export function CitiesAdminPanel() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setCities(await fetchAdminCities());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load cities");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    const name = cityName.trim();
    if (!name) return;

    setSaving(true);
    setError("");
    try {
      await createAdminCity({ cityName: name });
      setCityName("");
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to add city");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(city: CityItem) {
    setSaving(true);
    setError("");
    try {
      await updateAdminCity(city.id, { isActive: !city.isActive });
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to update city");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="admin-city-name" className="mb-1 block text-sm font-medium text-foreground">
            Add city
          </label>
          <Input
            id="admin-city-name"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
            placeholder="e.g. Pune"
          />
        </div>
        <Button type="submit" disabled={saving || !cityName.trim()}>
          Add city
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <DataTable
        rows={cities}
        rowKey={(city) => city.id}
        emptyTitle={loading ? "Loading cities…" : "No cities"}
        columns={[
          { key: "name", header: "City", cell: (city) => city.cityName },
          { key: "slug", header: "Slug", cell: (city) => city.slug },
          { key: "order", header: "Order", cell: (city) => city.sortOrder },
          {
            key: "status",
            header: "Status",
            cell: (city) => (city.isActive ? "Active" : "Hidden"),
          },
          {
            key: "actions",
            header: "Actions",
            cell: (city) => (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving}
                onClick={() => void toggleActive(city)}
              >
                {city.isActive ? "Hide" : "Show"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
