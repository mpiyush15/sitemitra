import { apiFetch, apiFetchFormData } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type {
  ProfileCompletion,
  SafeBusinessProfile,
} from "@/types/api";

export type DashboardBusinessProfileResponse = {
  businessProfile: SafeBusinessProfile;
  profileCompletion: ProfileCompletion;
};

export type UpdateBusinessProfileInput = Partial<
  Pick<
    SafeBusinessProfile,
    | "businessName"
    | "slug"
    | "category"
    | "subCategory"
    | "city"
    | "state"
    | "description"
    | "services"
    | "experience"
    | "logo"
    | "thumbnail"
    | "profileBanner"
    | "gallery"
    | "whatsappNumber"
    | "phoneNumber"
    | "email"
    | "website"
    | "socialLinks"
  >
>;

export function getDashboardBusinessProfile() {
  return apiFetch<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessProfile,
  );
}

export function updateBusinessProfile(input: UpdateBusinessProfileInput) {
  return apiFetch<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessProfile,
    {
      method: "PATCH",
      body: input,
    },
  );
}

export function setBusinessPublished(publish: boolean) {
  return apiFetch<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.publish,
    {
      method: "POST",
      body: { publish },
    },
  );
}

function imageFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("image", file);
  return formData;
}

export function uploadBusinessLogo(file: File) {
  return apiFetchFormData<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessLogo,
    imageFormData(file),
  );
}

export function uploadBusinessThumbnail(file: File) {
  return apiFetchFormData<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessThumbnail,
    imageFormData(file),
  );
}

export function uploadBusinessProfileBanner(file: File) {
  return apiFetchFormData<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessProfileBanner,
    imageFormData(file),
  );
}

export function uploadBusinessGalleryImages(files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }
  return apiFetchFormData<DashboardBusinessProfileResponse>(
    API_ROUTES.dashboard.businessGallery,
    formData,
  );
}
