# Site Mitra — Component Inventory (Reusable)

> Rule: build `ui/` primitives first → compose `blocks/` → use in pages. No one-off page markup.

## Folder structure

```
apps/web/src/components/
├── ui/           # Design system primitives
├── layout/       # Shell, nav, dashboard layout
├── blocks/       # Reusable public page sections
├── forms/        # Form fields + full forms
├── business/     # Domain-specific components
├── dashboard/    # Logged-in business user UI
├── admin/        # Admin-only UI
└── payment/      # Upgrade & checkout UI
```

---

## 1. UI primitives (`components/ui/`)

| Component | Status | Used for |
|-----------|--------|----------|
| Button | 🟢 | CTAs, actions |
| Input | 🟢 | Text fields |
| Card (+ Header, Title, Description, Content) | 🟢 | Panels, cards |
| Badge | 🟢 | Plan, verified, featured tags |
| Skeleton | 🟢 | Loading states |
| Select | 🟢 | Filters, category/city dropdowns |
| Textarea | 🟢 | Description, inquiry message |
| Label | 🟢 | Form accessibility |
| Modal / Dialog | 🟢 | Confirm delete, upgrade prompt |
| Pagination | 🟢 | Listings, inquiries, admin tables |
| Avatar | 🟢 | Logo fallback, user avatar |
| Separator | 🟢 | Section dividers |
| Tabs | 🟢 | Dashboard sections |
| DropdownMenu | 🟢 | User menu, admin actions |
| Toast / Alert | 🟢 | Success/error feedback |
| Spinner | 🟢 | Button loading |
| FileUpload | 🟢 | Logo, gallery, catalogue |
| AppImage | 🟢 | next/image wrapper + fallback |
| EmptyState | 🟢 | No data placeholders |
| PlanBadge | 🟢 | Free vs Standard |
| RatingStars | 🟢 | Display + input rating |
| VerifiedBadge | 🟢 | Verification chip |

---

## 2. Layout (`components/layout/`)

| Component | Status | Used for |
|-----------|--------|----------|
| SiteHeader | 🟢 | Public nav |
| SiteFooter | 🟢 | Public footer |
| PublicPageShell | 🟢 | Header + main + footer wrapper |
| DashboardShell | 🟢 | Sidebar + topbar + content |
| AdminShell | 🟢 | Admin sidebar layout |
| Sidebar | 🟢 | Dashboard/admin nav |
| Topbar | 🟢 | User menu, logout |
| MobileNav | 🟢 | Hamburger menu |
| PageHeader | 🟢 | Title + breadcrumbs + actions |
| Breadcrumbs | 🟢 | SEO navigation |

---

## 3. Public blocks (`components/blocks/`)

| Component | Status | Used for |
|-----------|--------|----------|
| SearchBar | 🟢 | Homepage + listings search |
| CategoryGrid | 🟢 | Homepage categories |
| BusinessCard | 🟢 | Listing grid item |
| FeaturedSection | 🟢 | Homepage featured strip |
| CtaSection | 🟢 | Homepage bottom CTA |
| HeroSection | 🟢 | Homepage hero |
| FeaturedCarousel | 🟢 | Horizontal featured scroll |
| ListingsGrid | 🟢 | Grid + empty state wrapper |
| ListingsFilters | 🟢 | Category/city/sort filters bar |
| ProfileHeader | 🟢 | Business name, badges, contact CTAs |
| GalleryGrid | 🟢 | Standard member project photos |
| ReviewsList | 🟢 | Approved reviews list |
| ReviewCard | 🟢 | Single review |
| CatalogueList | 🟢 | Downloadable catalogues |
| CatalogueCard | 🟢 | Single catalogue item |
| ContactActions | 🟢 | WhatsApp + Call buttons |
| PremiumUpsellBanner | 🟢 | Free profile upgrade prompt |
| TestimonialsSection | 🟢 | Homepage social proof |
| VendorShowcase | 🟢 | Homepage vendor strip |
| BannerCarousel | 🟢 | Homepage promo banners |

---

## 4. Forms (`components/forms/`)

| Component | Status | Used for |
|-----------|--------|----------|
| FormField | 🟢 | Label + error wrapper |
| LoginForm | 🟢 | Auth page |
| RegisterForm | 🟢 | Business signup |
| InquiryForm | 🟢 | Lead capture on profile |
| ProfileEditForm | 🟢 | Dashboard profile edit |
| CategoryForm | 🟢 | Admin add/edit category |
| BannerForm | 🟢 | Admin homepage banner |
| SearchFiltersForm | 🟢 | Controlled listings filters |

---

## 5. Business domain (`components/business/`)

| Component | Status | Used for |
|-----------|--------|----------|
| MembershipPlanCard | 🟢 | Free vs Standard comparison |
| PlanFeatureList | 🟢 | Plan bullets on upgrade page |
| BusinessSummary | 🟢 | Compact card data display |
| SocialLinks | 🟢 | Facebook, Instagram, etc. |
| ServicesTags | 🟢 | Service chips on profile |
| WhatsAppButton | 🟢 | wa.me link with prefilled text |
| CallButton | 🟢 | tel: link |
| SlugPreview | 🟢 | Show profile URL while editing |
| MembershipStatus | 🟢 | Active plan + expiry in dashboard |

---

## 6. Dashboard (`components/dashboard/`)

| Component | Status | Used for |
|-----------|--------|----------|
| DashboardOverview | 🟢 | Stats cards (leads, plan, views) |
| ProfileEditor | 🟢 | Edit business fields |
| LogoUploader | 🟢 | Single image upload |
| GalleryUploader | 🟢 | Multi image (Standard only) |
| CatalogueUploader | 🟢 | PDF/images (Standard only) |
| InquiriesTable | 🟢 | Lead list for business |
| InquiryRow | 🟢 | Single lead row |
| InquiryStatusBadge | 🟢 | new / contacted / closed |
| UpgradeCTA | 🟢 | Link to payment flow |

---

## 7. Admin (`components/admin/`)

| Component | Status | Used for |
|-----------|--------|----------|
| UsersTable | 🟢 | Manage users |
| BusinessesTable | 🟢 | Moderate listings |
| CategoriesTable | 🟢 | CRUD categories |
| PaymentsTable | 🟢 | Payment history |
| ReviewsModerationTable | 🟢 | Approve/reject reviews |
| FeatureToggle | 🟢 | Feature business / banner |
| AdminStatsCards | 🟢 | Overview metrics |
| DataTable | 🟢 | Shared sortable table base |
| ConfirmDialog | 🟢 | Delete / moderate confirm |

---

## 8. Payment (`components/payment/`)

| Component | Status | Used for |
|-----------|--------|----------|
| UpgradePage | 🟢 | Plan selection |
| RazorpayCheckout | 🟢 | Client checkout trigger |
| PaymentSuccess | 🟢 | Post-payment state |
| PaymentFailed | 🟢 | Error + retry |

---

## Reuse rules

1. Pages only compose — `app/**/page.tsx` imports components, no duplicated markup.
2. Props over forks — one component, variants via props.
3. Server default — `"use client"` only for forms, modals, uploads, Razorpay.
4. Types from `@/types/api` — pass `BusinessCard`, `BusinessDetail`, etc.
5. Empty states built-in — every list/grid/table handles `[]` and loading.
