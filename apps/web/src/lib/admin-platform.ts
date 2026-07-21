import { apiFetch, apiFetchFormData } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";
import type { CategoryItem, SafeUser } from "@/types/api";

export type AdminBusinessRow = {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  category: string;
  city: string;
  membershipType: string;
  isPublished: boolean;
  /** Super admin: platform listing visibility */
  isActive: boolean;
  /** Homepage / featured sections */
  isFeatured: boolean;
  email: string;
};

export type AdminReviewRow = {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isApproved: boolean;
  createdAt: string;
};

export type AdminBannerRow = {
  id: string;
  title: string;
  imageUrl: string;
  redirectUrl: string;
  isActive: boolean;
  sortOrder: number;
  showOverlay: boolean;
};

export type AdminPaymentRow = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  membershipPlan: string;
  paidAt: string | null;
  createdAt: string;
};

export async function fetchAdminUsers(): Promise<SafeUser[]> {
  return apiFetch<SafeUser[]>(API_ROUTES.admin.users);
}

export async function fetchAdminBusinesses(): Promise<AdminBusinessRow[]> {
  const rows = await apiFetch<AdminBusinessRow[]>(API_ROUTES.admin.businesses);
  return rows.map((row) => ({
    ...row,
    isActive: row.isActive !== false,
    isFeatured: Boolean(row.isFeatured),
  }));
}

export async function assignAdminBusinessPlan(businessId: string, planSlug: string) {
  return apiFetch(`${API_ROUTES.admin.businesses}/${businessId}/membership`, {
    method: "PATCH",
    body: { planSlug },
  });
}

export async function setAdminBusinessListingActive(businessId: string, isActive: boolean) {
  return apiFetch<{ id: string; isActive: boolean }>(
    API_ROUTES.admin.membership.businessListing(businessId),
    {
      method: "PATCH",
      body: { isActive },
    },
  );
}

export async function setAdminBusinessFeatured(businessId: string, isFeatured: boolean) {
  return apiFetch<{ id: string; isFeatured: boolean }>(
    API_ROUTES.admin.membership.businessFeatured(businessId),
    {
      method: "PATCH",
      body: { isFeatured },
    },
  );
}

export async function fetchAdminCategories(): Promise<CategoryItem[]> {
  return apiFetch<CategoryItem[]>(API_ROUTES.admin.categories);
}

export async function createAdminCategory(body: {
  categoryName: string;
  icon?: string;
  sortOrder?: number;
}): Promise<CategoryItem> {
  return apiFetch<CategoryItem>(API_ROUTES.admin.categories, {
    method: "POST",
    body,
  });
}

export async function updateAdminCategory(
  id: string,
  body: Partial<{ categoryName: string; icon: string; sortOrder: number; isActive: boolean }>
): Promise<CategoryItem> {
  return apiFetch<CategoryItem>(`${API_ROUTES.admin.categories}/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function fetchAdminReviews(): Promise<AdminReviewRow[]> {
  return apiFetch<AdminReviewRow[]>(API_ROUTES.admin.reviews);
}

export async function moderateAdminReview(id: string, isApproved: boolean) {
  return apiFetch(`${API_ROUTES.admin.reviews}/${id}`, {
    method: "PATCH",
    body: { isApproved },
  });
}

export async function deleteAdminReview(id: string) {
  return apiFetch(`${API_ROUTES.admin.reviews}/${id}`, {
    method: "DELETE",
  });
}

export async function fetchAdminBanners(): Promise<AdminBannerRow[]> {
  const rows = await apiFetch<AdminBannerRow[]>(API_ROUTES.admin.banners);
  return rows.map((row) => ({
    ...row,
    showOverlay: row.showOverlay !== false,
  }));
}

export async function createAdminBanner(formData: FormData): Promise<AdminBannerRow> {
  return apiFetchFormData<AdminBannerRow>(API_ROUTES.admin.membership.banners, formData);
}

export async function updateAdminBanner(
  id: string,
  body: Partial<
    Pick<AdminBannerRow, "title" | "redirectUrl" | "sortOrder" | "isActive" | "showOverlay">
  >,
): Promise<AdminBannerRow> {
  return apiFetch<AdminBannerRow>(API_ROUTES.admin.membership.banner(id), {
    method: "PATCH",
    body,
  });
}

export async function replaceAdminBannerImage(id: string, file: File): Promise<AdminBannerRow> {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetchFormData<AdminBannerRow>(API_ROUTES.admin.membership.bannerImage(id), formData);
}

export async function deleteAdminBanner(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(API_ROUTES.admin.membership.banner(id), {
    method: "DELETE",
  });
}

export async function fetchAdminPayments(): Promise<AdminPaymentRow[]> {
  return apiFetch<AdminPaymentRow[]>(API_ROUTES.admin.membership.payments);
}
