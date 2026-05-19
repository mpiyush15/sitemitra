"use client";

import { useState, type FormEvent } from "react";
import { LogoUploader } from "@/components/dashboard/logo-uploader";
import { PlanUpgradeLock } from "@/components/dashboard/plan-upgrade-lock";
import { ProfileBannerUploader } from "@/components/dashboard/profile-banner-uploader";
import { ThumbnailUploader } from "@/components/dashboard/thumbnail-uploader";
import {
  GalleryUploader,
  type GalleryUploaderValue,
} from "@/components/dashboard/gallery-uploader";
import { ServicesListEditor } from "@/components/dashboard/services-list-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { SlugPreview } from "@/components/business/slug-preview";
import { SocialLinkFields } from "@/components/forms/social-link-fields";
import { Spinner } from "@/components/ui/spinner";
import { useCategories } from "@/hooks/use-categories";
import { isPremiumBusiness } from "@/lib/membership-display";
import type { SafeBusinessProfile } from "@/types/api";

export type ProfileEditFormData = Partial<SafeBusinessProfile> & {
  logoFile?: File | null;
  thumbnailFile?: File | null;
  profileBannerFile?: File | null;
  galleryFiles?: File[];
};

type ProfileEditFormProps = {
  initial?: Partial<SafeBusinessProfile>;
  onSubmit?: (data: ProfileEditFormData) => void | Promise<void>;
};

export function ProfileEditForm({ initial = {}, onSubmit }: ProfileEditFormProps) {
  const isStandard = isPremiumBusiness({ membershipType: initial.membershipType });
  const { categories } = useCategories();
  const [form, setForm] = useState({
    businessName: initial.businessName ?? "",
    slug: initial.slug ?? "",
    category: initial.category ?? "",
    description: initial.description ?? "",
    experience: initial.experience ?? "",
    city: initial.city ?? "",
    state: initial.state ?? "",
    whatsappNumber: initial.whatsappNumber ?? "",
    phoneNumber: initial.phoneNumber ?? "",
    email: initial.email ?? "",
    website: initial.website ?? "",
    facebook: initial.socialLinks?.facebook ?? "",
    instagram: initial.socialLinks?.instagram ?? "",
    linkedin: initial.socialLinks?.linkedin ?? "",
    youtube: initial.socialLinks?.youtube ?? "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<GalleryUploaderValue>({
    urls: initial.gallery ?? [],
    files: [],
  });
  const [services, setServices] = useState<string[]>(initial.services ?? []);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.({
        businessName: form.businessName,
        slug: form.slug,
        category: form.category,
        description: form.description,
        experience: form.experience,
        city: form.city,
        state: form.state,
        whatsappNumber: form.whatsappNumber,
        phoneNumber: form.phoneNumber,
        email: form.email,
        website: isStandard ? form.website : "",
        socialLinks: {
          facebook: isStandard ? form.facebook : "",
          instagram: form.instagram,
          linkedin: form.linkedin,
          youtube: form.youtube,
        },
        services,
        logo: initial.logo ?? "",
        thumbnail: initial.thumbnail ?? "",
        profileBanner: initial.profileBanner ?? "",
        gallery: gallery.urls,
        logoFile,
        thumbnailFile,
        profileBannerFile,
        galleryFiles: gallery.files,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Star rating and review count come from customer reviews after your listing is live — they are
        not set manually here.
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Business details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Core info shown on your public listing card and profile.
            </p>
          </div>

          <FormField label="Business name" htmlFor="pe-name">
            <Input id="pe-name" value={form.businessName} onChange={set("businessName")} required />
          </FormField>
          <FormField label="Slug" htmlFor="pe-slug" hint="Used in your public profile URL">
            <Input id="pe-slug" value={form.slug} onChange={set("slug")} />
            <SlugPreview slug={form.slug} className="mt-2" />
          </FormField>
          <FormField label="Category" htmlFor="pe-category">
            <Select id="pe-category" value={form.category} onChange={set("category")} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Description" htmlFor="pe-desc" hint="At least 30 characters for publishing">
            <Textarea id="pe-desc" value={form.description} onChange={set("description")} rows={5} />
          </FormField>
          <FormField label="Experience" htmlFor="pe-exp" hint="Years or scope of work">
            <Input
              id="pe-exp"
              value={form.experience}
              onChange={set("experience")}
              placeholder="e.g. 10+ years in residential construction"
            />
          </FormField>
          <FormField
            label="Services offered"
            hint="List what your business provides — shown as tags on your public profile."
          >
            <ServicesListEditor value={services} onChange={setServices} />
          </FormField>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Contact & media</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Location, reachability, social links, logo, and gallery photos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="City" htmlFor="pe-city">
              <Input id="pe-city" value={form.city} onChange={set("city")} />
            </FormField>
            <FormField label="State" htmlFor="pe-state">
              <Input id="pe-state" value={form.state} onChange={set("state")} />
            </FormField>
          </div>
          <FormField label="WhatsApp" htmlFor="pe-wa">
            <Input id="pe-wa" value={form.whatsappNumber} onChange={set("whatsappNumber")} />
          </FormField>
          <FormField label="Phone" htmlFor="pe-phone">
            <Input id="pe-phone" value={form.phoneNumber} onChange={set("phoneNumber")} />
          </FormField>
          <FormField label="Business email" htmlFor="pe-email" hint="Shown on your public profile">
            <Input
              id="pe-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="contact@yourbusiness.com"
            />
          </FormField>

          {isStandard ? (
            <FormField label="Website" htmlFor="pe-web">
              <Input id="pe-web" value={form.website} onChange={set("website")} placeholder="https://" />
            </FormField>
          ) : (
            <PlanUpgradeLock
              title="Website link"
              description="Add your business website on the Standard plan."
            />
          )}

          <div className="space-y-3 border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground">Social links</h4>
            {!isStandard ? (
              <PlanUpgradeLock
                title="Facebook link"
                description="Connect your Facebook page with a Standard listing."
              />
            ) : null}
            <SocialLinkFields
              exclude={isStandard ? [] : ["facebook"]}
              value={{
                facebook: form.facebook,
                instagram: form.instagram,
                linkedin: form.linkedin,
                youtube: form.youtube,
              }}
              onChange={(key, val) => setForm((f) => ({ ...f, [key]: val }))}
            />
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <FormField label="Business logo" hint="Profile page logo — 400×400 square (1:1).">
              <LogoUploader existingUrl={initial.logo} onChange={setLogoFile} />
            </FormField>

            <FormField
              label="Listing thumbnail"
              hint="Shown on browse/search cards — 400×400 square (1:1). Replace to change."
            >
              <ThumbnailUploader existingUrl={initial.thumbnail} onChange={setThumbnailFile} />
            </FormField>

            <FormField
              label="Profile banner"
              hint="Cover at top of public profile — 1080×480."
            >
              <ProfileBannerUploader
                existingUrl={initial.profileBanner}
                onChange={setProfileBannerFile}
              />
            </FormField>

            <FormField
              label="Gallery images"
              hint="Up to 10 project photos. Shown on your public profile."
            >
              <GalleryUploader
                existingUrls={initial.gallery}
                maxImages={10}
                onChange={setGallery}
              />
            </FormField>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Save profile"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Logo, banner, and gallery upload when you save.
        </p>
      </div>
    </form>
  );
}
