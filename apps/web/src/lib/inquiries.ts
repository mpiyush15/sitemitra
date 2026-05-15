import { apiFetch } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants";

export type InquiryItem = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  requirement: string;
  status: string;
  createdAt: string;
};

export type SubmitInquiryInput = {
  customerName: string;
  phone: string;
  city?: string;
  requirement: string;
};

export async function submitBusinessInquiry(slug: string, input: SubmitInquiryInput) {
  return apiFetch<{ id: string; message: string }>(
    `${API_ROUTES.businesses}/${slug}/inquiries`,
    {
      method: "POST",
      body: input,
    },
  );
}

export async function fetchDashboardInquiries(): Promise<InquiryItem[]> {
  return apiFetch<InquiryItem[]>(API_ROUTES.dashboard.inquiries);
}
