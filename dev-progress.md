# Site Mitra — Dev Progress Log

> **Current stable: Site Mitra v1.1.0** (15 May 2026)  
> **Previous stable: v1.0.0** (14 May 2026)  
> **Next (v1.2):** platform banners on listings page, stricter plan gating, Razorpay live, reviews/catalogue uploads

---

## v1.1.0 — Current stable (what ships now)

| Area | Included |
|------|----------|
| **Hero banners (platform)** | Super Admin upload → S3 + WebP; public carousel on homepage `SearchPlatformHero`; overlay toggle, fade carousel |
| **Business media (S3)** | Logo **400×400** (1:1), **listing thumbnail** **400×400** (1:1), **profile banner** **1080×480**, gallery (up to 10); dashboard upload on save |
| **Listings UX** | Cards use **thumbnail** (fallback logo); square 1:1 image on listing cards |
| **Public profile** | Cover uses `profileBanner` → gallery → logo |
| **Env** | `AWS_*`, `S3_BUCKET_NAME`, `S3_PREFIX`, `S3_PUBLIC_BASE_URL` on API |
| **Everything from v1.0.0** | See below — still included |

**Not in v1.1.0** (planned v1.2+): admin banners on `/listings`, mid-grid promo slots, batch enquiry, Razorpay production, catalogue file uploads, full reviews CMS.

---

## v1.0.0 — Previous stable (baseline before media work)

| Area | Included |
|------|----------|
| Public site | Homepage, search (smart), listings, business profiles, SEO routes |
| Auth | Register/login modal, business dashboard shell, super admin shell |
| Listings | Filters, pagination, featured, city/category search, listing rows |
| Business profile | Contact, WhatsApp enquiry message, sidebar enquiry form |
| Inquiries | Public submit → business dashboard list (API wired) |
| Analytics | Profile visitors + enquiry counts (business + super admin overview) |
| Admin | Overview analytics, cities, social reels |
| Mobile | Bottom nav, scroll-reveal header search, reels carousel |

**Was not in v1.0.0** (added in v1.1.0): S3 image pipeline, hero banner admin + carousel, business logo/thumbnail/banner/gallery uploads, 400×400 / 1080×480 crop rules.

**Still planned after v1.1.0:** strict Free/Standard feature gating everywhere, Razorpay live, reviews/catalogue upload APIs, listings-page platform banners.

---

## Status overview

| Phase | Status | Notes |
|-------|--------|-------|
| Day 0 — Foundation | Done | |
| Day 1 — Models + Auth + RBAC | Done | |
| Day 2 — Public discovery | Done | Live data via MongoDB |
| Component library | Done | 94 reusable components — see `components.md` |
| UI — Shell (top bar, nav, footer, hero) | Done | Client copy from `site-mitra-details.txt` |
| UI — Auth (modal, dashboard, API wired) | Done | MongoDB connected; register/login tested |
| UI — Platform admin shell | Done (v1.1) | Overview, cities, reels, **banners** (S3) |
| UI implementation (remaining pages) | Done (v1.0 core) | Listings, profile, enquiries, analytics |
| Day 3 — Dashboard + inquiries (API) | Done (v1.0) | Enquiries + analytics APIs |
| Business profile media (S3) | Done (v1.1) | Logo, thumbnail, banner, gallery |
| Hero banners (S3) | Done (v1.1) | Super Admin + homepage carousel |
| Day 4 — Razorpay + membership | **v1.2** | Plans admin, assign plan, payment settings live |
| Day 5 — Polish + hardening | Not started | |

---

## Day 0 — Foundation (Done)

- [x] API: Express scaffold, env config, DB connection layer, health route
- [x] API: Response helpers, Zod validate, error classes, constants
- [x] Web: Tailwind theme, base UI (Button, Input, Card, Badge, Skeleton)
- [x] Web: API client, constants, types, foundation homepage
- [x] Env templates: `apps/api/.env`, `apps/web/.env.local`

## Day 1 — Models + Auth + RBAC (Done)

- [x] Mongoose models: User, BusinessProfile, Category, Inquiry, Membership, Payment, Review, Catalogue, Banner
- [x] Repositories: user, business-profile
- [x] Auth service + routes: register, login, profile, logout
- [x] JWT: Bearer + httpOnly cookie
- [x] Middleware: authenticate, RBAC, requireDatabase
- [x] Web: aligned constants, auth types, `lib/auth.ts`

## Day 2 — Public discovery (Done)

### API
- [x] Repositories: category, review, catalogue; extended business-profile (list, featured, filters)
- [x] Services: `categoryService`, `businessService` (plan-gated detail)
- [x] Validators: business list / featured / slug query
- [x] Routes: `GET /api/categories`, `GET /api/businesses`, `GET /api/businesses/featured`, `GET /api/businesses/:slug`
- [x] Pagination helper + public serializers (card vs detail, Standard gating)

### Web
- [x] Blocks: SiteHeader, SiteFooter, SearchBar, CategoryGrid, BusinessCard, FeaturedSection, CtaSection
- [x] Homepage: hero, search, categories (fallback when no DB), featured, CTA
- [x] Listings: `/listings` with filters, pagination, featured mode
- [x] SEO URLs: `/listings/[category]`, `/listings/[category]/[city]` → query redirects
- [x] Business profile: `/business/[slug]` (free vs Standard views, WhatsApp/call)
- [x] SEO: page metadata, Open Graph, JSON-LD on profile, `sitemap.ts`, `robots.ts`
- [x] Lib: `lib/public.ts`, `lib/seo.ts`, types + `FALLBACK_CATEGORIES`

## Component library (Done)

Full inventory tracked in [`components.md`](components.md) — all marked complete.

- [x] **ui/** — 22 primitives
- [x] **layout/**, **blocks/**, **forms/**, **business/**, **dashboard/**, **admin/**, **payment/**
- [x] Empty / loading states on all components

## UI — Shell & homepage (Done)

Based on `site-mitra-details.txt` + reference UI (mobile-first).

- [x] Brand tokens: navy primary `#1e3a5f`, accent orange `#d4622a`
- [x] `TopNotificationBar` — social icons, email, WhatsApp (placeholders until client shares)
- [x] `SiteHeader` — logo, tagline, full nav, Login, List Your Business, mobile hamburger; **light grey glassmorphism** (`.glass-panel`)
- [x] `SiteFooter` — quick links, categories, contact, Akola office, launch cities
- [x] `HeroSection` — construction hero image, client H1/subcopy, CTAs
- [x] `HeroSearchBar` — mobile-stacked search (query + category + city Akola/Amravati)
- [x] `CategoryGrid` + `CategoryIcon` — 16 client categories, large `react-icons`
- [x] Homepage wired: hero, promo strip, categories, featured, CTA
- [x] `CLIENT_CATEGORIES` + `HERO_CONTENT` in `lib/constants.ts`
- [x] `SearchPlatformHero` — second hero section below main hero

## UI — Auth modal & session (Done)

- [x] MongoDB Atlas connected (`apps/api/.env` — encode `@` in password as `%40`)
- [x] API auth flow verified: register → login → profile
- [x] `lib/session.ts` — JWT in `localStorage`, Bearer on `apiFetch`
- [x] Reusable `AuthModal` (`components/layout/auth-modal.tsx`) — login ↔ signup toggle
- [x] `AuthModalProvider` + `AuthModalHost` + `AuthModalUrlSync` via `AppProviders` in root layout
- [x] Header CTAs open modal on same page (no separate auth page navigation)
- [x] `/login`, `/register` redirect to `/?auth=login` / `/?auth=register`
- [x] `LoginForm` + `RegisterForm` reused inside modal
- [x] **Signup 2-step wizard:** Step 1 personal (name, email, phone, password) → Step 2 business (name, category, city; optional)
- [x] Modal: simple white background, compact layout, no scrollbar
- [x] `/dashboard` — profile, plan badge, logout; 401 → login modal
- [x] Shared glass CSS utilities in `globals.css` (`.glass-panel`, `.glass-modal`, `.glass-overlay`) — nav uses glass; auth modal stays white
- [x] `Modal` component supports `variant="glass"` for future reuse

## UI implementation (Next)

### Public pages (remaining)
- [ ] Listings → `ListingsGrid`, `ListingsFilters`, `Pagination`
- [ ] Business profile → `ProfileHeader`, `ContactActions`, `GalleryGrid`, `InquiryForm`, etc.
- [ ] Homepage extras → `FeaturedCarousel`, `TestimonialsSection`, `VendorShowcase`, `BannerCarousel`

### Auth (done — modal-based)
- [x] Login + signup in `AuthModal` (not standalone pages)
- [x] 2-step register form
- [x] Dashboard shell at `/dashboard`

### Auth pages (legacy redirects only)
- [x] `/login` → `/?auth=login`
- [x] `/register` → `/?auth=register`

### Dashboard (UI shell)
- [ ] `/dashboard/profile`, `/dashboard/inquiries`, `/dashboard/upgrade`

### Admin (platform layout — done for shell)
- [x] `SUPER_ADMIN` role + `seed:superadmin` script (`super@sitemitra.com`)
- [x] `app/admin/layout.tsx` — shared auth guard + platform shell for all `/admin/*`
- [x] `PlatformShell` — TailAdmin-style sidebar + topbar + main content area
- [x] `PlatformSidebar` — grouped nav, icons, **glass morphism active tab** (`.glass-sidebar-active`)
- [x] `PlatformTopbar` — page title, avatar menu, mobile hamburger
- [x] `lib/platform-nav.ts` — RBAC nav config (`filterPlatformNav` by role)
  - Menu: Overview, Users, Businesses, Categories, Reviews → `admin` + `super_admin`
  - Platform: Payments, Banners → `super_admin` only
- [x] Mobile drawer sidebar overlay
- [x] `/admin` overview page content only (stats cards); layout handled by parent
- [x] Platform login redirect → `/admin`; business users → `/dashboard`
- [x] `SiteChrome` hides marketing header/footer on `/admin` and `/dashboard`
- [ ] `/admin/users`, `/admin/businesses`, `/admin/categories`, etc. (page content next)

## Day 3 — Dashboard + inquiries API (After UI)

- [ ] Business profile edit, inquiry APIs, admin basics
- [ ] Connect forms to live APIs + admin CMS for homepage content

## Day 4 — Payments (Not started)

- [ ] Razorpay order, verify, webhook, membership activation

## Day 5 — Polish (Not started)

- [ ] Performance, security pass, production config

---

## Blockers / waiting on client

- [x] **MongoDB Atlas** — connected and tested
- [ ] Run **`npm run dev`** in `apps/api` (use `tsx watch`, not stale `node dist/index.js` on port 4000)
- [ ] Real contact email, phone, social links (using placeholders in top bar/footer)
- [ ] `JWT_SECRET` (production — dev placeholder set)
- [ ] Razorpay keys + plan price

---

## Changelog

| Date | What was completed |
|------|-------------------|
| 14 May 2026 | Day 0 foundation |
| 14 May 2026 | Day 1 models + auth + RBAC |
| 14 May 2026 | Day 2 public discovery |
| 14 May 2026 | Component library (94 components) |
| 14 May 2026 | UI shell — top notification bar, navbar, footer, pro mobile-first homepage, react-icons categories |
| 14 May 2026 | Auth UI: `/login`, `/register`, `/dashboard` + session token wiring |
| 14 May 2026 | MongoDB connected; API auth flow tested end-to-end |
| 14 May 2026 | Auth modal on same page — reusable `AuthModal`, provider, URL sync |
| 14 May 2026 | Navbar light grey glassmorphism; signup 2-step form (personal → business) |
| 14 May 2026 | Super admin seeded; `/admin` platform dashboard shell + role-based routing |
| 14 May 2026 | Platform admin layout — TailAdmin-style sidebar/topbar, RBAC nav, glass active tabs |
| 14 May 2026 | **Site Mitra v1.0.0** (previous stable) — listings, smart search, enquiries, analytics, reels, mobile UX |
| 15 May 2026 | **Site Mitra v1.1.0** (current stable) — S3 uploads, hero banners, business logo + listing thumbnail (400×400) + profile banner (1080×480) + gallery |
| 15 May 2026 | **Next (v1.2):** listings-page banners, plan gating polish, Razorpay, reviews/catalogue uploads |
