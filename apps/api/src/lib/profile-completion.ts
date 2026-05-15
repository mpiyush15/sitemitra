import type { BusinessProfileDocument } from "../models/business-profile.model.js";

export type ProfileCompletion = {
  isComplete: boolean;
  missing: string[];
  percent: number;
};

const REQUIRED_CHECKS: Array<{
  key: string;
  label: string;
  test: (profile: BusinessProfileDocument) => boolean;
}> = [
  { key: "businessName", label: "Business name", test: (p) => (p.businessName ?? "").trim().length >= 2 },
  { key: "category", label: "Category", test: (p) => (p.category ?? "").trim().length > 0 },
  { key: "city", label: "City", test: (p) => (p.city ?? "").trim().length > 0 },
  {
    key: "description",
    label: "Description",
    test: (p) => (p.description ?? "").trim().length >= 30,
  },
  {
    key: "contact",
    label: "Phone or WhatsApp",
    test: (p) => Boolean((p.phoneNumber ?? "").trim() || (p.whatsappNumber ?? "").trim()),
  },
  {
    key: "services",
    label: "At least one service",
    test: (p) => (p.services?.length ?? 0) > 0,
  },
  {
    key: "experience",
    label: "Experience",
    test: (p) => (p.experience ?? "").trim().length >= 3,
  },
];

export function getProfileCompletion(profile: BusinessProfileDocument): ProfileCompletion {
  const missing = REQUIRED_CHECKS.filter((item) => !item.test(profile)).map(
    (item) => item.label,
  );
  const done = REQUIRED_CHECKS.length - missing.length;
  return {
    isComplete: missing.length === 0,
    missing,
    percent: Math.round((done / REQUIRED_CHECKS.length) * 100),
  };
}
