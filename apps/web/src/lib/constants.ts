export const SITE_NAME = "Site Mitra";
export const SITE_TAGLINE = "Right People for Every Site.";
export const SITE_PLATFORM_LINE = "One platform. All solutions.";

export const SITE_OFFICE = "Akola, Maharashtra, India";
export const LAUNCH_CITIES = ["Akola", "Amravati"] as const;

/** Placeholders until client shares contact details */
export const SITE_CONTACT = {
  email: "contact@sitemitra.com",
  phone: "+91 99999 99999",
  whatsapp: "+919999999999",
} as const;

export const SITE_SOCIAL = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
} as const;

export const HERO_CONTENT = {
  eyebrow: "India's trusted construction network",
  heading:
    "Find Trusted Engineers, Contractors, Material Vendors & Construction Professionals Near You",
  subheading:
    "Site Mitra connects homeowners and builders with trusted construction professionals, vendors, and service providers.",
  promo:
    "Site Mitra helps users discover trusted engineers, contractors, architects, vendors, and construction businesses in one platform.",
} as const;

export const TOP_SEARCHES = [
  { label: "Contractors in Akola", href: "/listings?category=contractors&city=Akola" },
  { label: "Architects in Akola", href: "/listings?category=architects&city=Akola" },
  { label: "Material vendors", href: "/listings?category=material-vendors" },
  { label: "Civil engineers", href: "/listings?category=civil-engineers" },
  { label: "Plumbers in Amravati", href: "/listings?category=plumbers&city=Amravati" },
  { label: "Tile & marble dealers", href: "/listings?category=tile-marble-dealers" },
  { label: "Steel suppliers", href: "/listings?category=steel-suppliers" },
  { label: "Featured listings", href: "/listings?featured=1" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Search your city & category",
    description: "Find engineers, contractors, vendors, and specialists in Akola and Amravati.",
  },
  {
    step: "02",
    title: "Compare trusted profiles",
    description: "View services, experience, gallery, ratings, and contact details in one place.",
  },
  {
    step: "03",
    title: "Connect directly",
    description: "Call or WhatsApp businesses instantly — no middlemen for discovery.",
  },
] as const;

export const WHY_CHOOSE_ITEMS = [
  {
    title: "One construction network",
    description:
      "Engineers, contractors, architects, vendors, and service providers on a single trusted platform.",
  },
  {
    title: "Local focus",
    description: "Built for Akola and Amravati first — relevant professionals near your project site.",
  },
  {
    title: "Business-ready listings",
    description: "Verified badges, galleries, and Standard plans help serious businesses stand out.",
  },
  {
    title: "Simple for homeowners",
    description:
      "Our mission is to make finding the right construction partner clear, fast, and dependable.",
  },
] as const;

export const HOME_TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "We found a reliable contractor in Akola within a day. Site Mitra made comparing options much easier.",
    author: "Homeowner, Akola",
    role: "Residential project",
  },
  {
    id: "t2",
    quote:
      "Listing our material supply business brought genuine inquiries from builders in the region.",
    author: "Vendor partner",
    role: "Building materials",
  },
  {
    id: "t3",
    quote:
      "A clear profile with services and photos helps clients trust us before the first call.",
    author: "Contractor, Amravati",
    role: "Commercial & residential",
  },
] as const;

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/listings" },
  { label: "Professionals", href: "/listings" },
  { label: "Vendors", href: "/listings?category=material-vendors" },
  { label: "Featured", href: "/listings?featured=1" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Slim links for mobile drawer — search-first; full browse is in hero + header search */
export const PUBLIC_MOBILE_NAV = [
  { label: "Home", href: "/" },
  { label: "Browse listings", href: "/listings" },
] as const;

export const ROLES = {
  USER: "user",
  BUSINESS: "business",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const MEMBERSHIP_PLANS = {
  FREE: "free",
  STANDARD: "standard",
} as const;

export type MembershipPlan =
  (typeof MEMBERSHIP_PLANS)[keyof typeof MEMBERSHIP_PLANS];

export const INQUIRY_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  CLOSED: "closed",
} as const;

export const API_ROUTES = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    profile: "/auth/profile",
    logout: "/auth/logout",
  },
  categories: "/categories",
  cities: "/cities",
  plans: "/plans",
  banners: "/banners",
  admin: {
    cities: "/admin/cities",
    socialReels: "/admin/social-reels",
    analytics: "/admin/analytics",
    users: "/admin/users",
    businesses: "/admin/businesses",
    categories: "/admin/categories",
    reviews: "/admin/reviews",
    banners: "/admin/banners",
    membership: {
      plans: "/admin/membership/plans",
      paymentSettings: "/admin/membership/payment-settings",
      payments: "/admin/membership/payments",
      businessListing: (businessId: string) =>
        `/admin/membership/businesses/${encodeURIComponent(businessId)}/listing`,
      businessFeatured: (businessId: string) =>
        `/admin/membership/businesses/${encodeURIComponent(businessId)}/featured`,
      banners: "/admin/membership/banners",
      banner: (id: string) => `/admin/membership/banners/${encodeURIComponent(id)}`,
      bannerImage: (id: string) =>
        `/admin/membership/banners/${encodeURIComponent(id)}/image`,
    },
  },
  socialReels: "/social-reels",
  businesses: "/businesses",
  customer: {
    engagement: (slug: string) =>
      `/customer/businesses/${encodeURIComponent(slug)}/engagement`,
    saved: (slug: string) => `/customer/businesses/${encodeURIComponent(slug)}/saved`,
    review: (slug: string) => `/customer/businesses/${encodeURIComponent(slug)}/reviews`,
  },
  search: {
    popular: "/search/popular",
    record: "/search/record",
  },
  dashboard: {
    businessProfile: "/dashboard/business-profile",
    businessLogo: "/dashboard/business-profile/logo",
    businessThumbnail: "/dashboard/business-profile/thumbnail",
    businessProfileBanner: "/dashboard/business-profile/profile-banner",
    businessGallery: "/dashboard/business-profile/gallery",
    publish: "/dashboard/business-profile/publish",
    inquiries: "/dashboard/inquiries",
    analytics: "/dashboard/analytics",
    upgrade: "/dashboard/upgrade",
  },
} as const;

/** Client category list from site-mitra-details.txt */
export const CLIENT_CATEGORIES = [
  { id: "civil-engineers", categoryName: "Civil Engineers", slug: "civil-engineers", iconKey: "engineer" },
  { id: "architects", categoryName: "Architects", slug: "architects", iconKey: "architect" },
  { id: "contractors", categoryName: "Contractors", slug: "contractors", iconKey: "contractor" },
  { id: "interior-designers", categoryName: "Interior Designers", slug: "interior-designers", iconKey: "interior" },
  { id: "material-vendors", categoryName: "Material Vendors", slug: "material-vendors", iconKey: "vendor" },
  { id: "cement-dealers", categoryName: "Cement Dealers", slug: "cement-dealers", iconKey: "cement" },
  { id: "steel-suppliers", categoryName: "Steel Suppliers", slug: "steel-suppliers", iconKey: "steel" },
  { id: "hardware-suppliers", categoryName: "Hardware Suppliers", slug: "hardware-suppliers", iconKey: "hardware" },
  { id: "electrical-contractors", categoryName: "Electrical Contractors", slug: "electrical-contractors", iconKey: "electrical" },
  { id: "plumbers", categoryName: "Plumbers", slug: "plumbers", iconKey: "plumber" },
  { id: "fabricators", categoryName: "Fabricators", slug: "fabricators", iconKey: "fabricator" },
  { id: "tile-marble-dealers", categoryName: "Tile & Marble Dealers", slug: "tile-marble-dealers", iconKey: "tile" },
  { id: "construction-machinery", categoryName: "Construction Machinery Suppliers", slug: "construction-machinery-suppliers", iconKey: "machinery" },
  { id: "surveyors", categoryName: "Surveyors", slug: "surveyors", iconKey: "surveyor" },
  { id: "painters", categoryName: "Painters", slug: "painters", iconKey: "painter" },
  { id: "building-material", categoryName: "Building Material Suppliers", slug: "building-material-suppliers", iconKey: "building" },
] as const;

/** @deprecated use CLIENT_CATEGORIES */
export const FALLBACK_CATEGORIES = CLIENT_CATEGORIES.map((c) => ({
  ...c,
  icon: c.iconKey,
}));
