"use client";

import { useCallback, useEffect, useState } from "react";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/lib/api";
import {
  getDashboardBusinessProfile,
  setBusinessPublished,
  updateBusinessProfile,
  uploadBusinessGalleryImages,
  uploadBusinessLogo,
  uploadBusinessProfileBanner,
  uploadBusinessThumbnail,
} from "@/lib/dashboard";
import type { ProfileEditFormData } from "@/components/forms/profile-edit-form";
import type { DashboardBusinessProfileResponse } from "@/lib/dashboard";

export default function DashboardProfilePage() {
  const [data, setData] = useState<DashboardBusinessProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [publishLoading, setPublishLoading] = useState(false);

  const loadProfile = useCallback(() => {
    setLoading(true);
    return getDashboardBusinessProfile()
      .then(setData)
      .catch((err) => {
        setError(err instanceof ApiClientError ? err.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (formData: ProfileEditFormData) => {
    setStatus("");
    setStatusIsError(false);
    try {
      let result = data!;

      if (formData.logoFile) {
        result = await uploadBusinessLogo(formData.logoFile);
      }
      if (formData.thumbnailFile) {
        result = await uploadBusinessThumbnail(formData.thumbnailFile);
      }
      if (formData.profileBannerFile) {
        result = await uploadBusinessProfileBanner(formData.profileBannerFile);
      }
      if (formData.galleryFiles && formData.galleryFiles.length > 0) {
        result = await uploadBusinessGalleryImages(formData.galleryFiles);
      }

      result = await updateBusinessProfile({
        businessName: formData.businessName,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        experience: formData.experience,
        city: formData.city,
        state: formData.state,
        whatsappNumber: formData.whatsappNumber,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        website: formData.website,
        services: formData.services,
        socialLinks: formData.socialLinks,
        gallery: formData.gallery,
      });

      setData(result);
      setFormKey((k) => k + 1);
      const uploaded = [
        formData.logoFile,
        formData.thumbnailFile,
        formData.profileBannerFile,
        formData.galleryFiles?.length ? true : null,
      ].some(Boolean);
      setStatus(
        uploaded
          ? "Profile saved. Images compressed and stored — refresh your public page to verify."
          : "Profile saved.",
      );
    } catch (err) {
      setStatusIsError(true);
      setStatus(err instanceof ApiClientError ? err.message : "Failed to save profile");
    }
  };

  const handlePublish = async (publish: boolean) => {
    setPublishLoading(true);
    setStatus("");
    try {
      const result = await setBusinessPublished(publish);
      setData(result);
      setStatus(publish ? "Your listing is now public." : "Listing removed from public search.");
    } catch (err) {
      setStatus(err instanceof ApiClientError ? err.message : "Could not update publish status");
    } finally {
      setPublishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.businessProfile) {
    return <p className="text-destructive">{error || "Something went wrong"}</p>;
  }

  const { businessProfile, profileCompletion } = data;
  const isPublished = businessProfile.isPublished;
  const listingActive = businessProfile.isActive !== false;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Business profile</h2>
        <p className="text-sm text-muted-foreground">
          Complete your details, save, then publish when you are ready to appear in listings.
        </p>
      </div>

      {!listingActive ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Your listing has been deactivated by platform administrators. It does not appear in public search
          or on your public profile URL until they activate it again. You can still edit your profile here.
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isPublished
                ? listingActive
                  ? "Published"
                  : "Published — hidden by platform"
                : "Draft — not visible in public listings"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Profile completion: {profileCompletion.percent}%
              {!profileCompletion.isComplete && profileCompletion.missing.length > 0
                ? ` — still need: ${profileCompletion.missing.join(", ")}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isPublished ? (
              <Button
                type="button"
                variant="outline"
                disabled={publishLoading}
                onClick={() => handlePublish(false)}
              >
                {publishLoading ? <Spinner size="sm" /> : "Unpublish"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={publishLoading || !profileCompletion.isComplete}
                onClick={() => handlePublish(true)}
              >
                {publishLoading ? <Spinner size="sm" /> : "Publish listing"}
              </Button>
            )}
          </div>
        </div>
        {status ? (
          <p
            className={`mt-3 text-sm ${statusIsError ? "text-destructive" : "text-muted-foreground"}`}
          >
            {status}
          </p>
        ) : null}
      </div>

      <ProfileEditor
        key={`${businessProfile.id}-${formKey}-${businessProfile.updatedAt}`}
        initial={businessProfile}
        onSubmit={handleSave}
      />
    </div>
  );
}
