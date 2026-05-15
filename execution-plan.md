# Site Mitra — MVP Execution Plan (Target: 15-05)

This document is the **delivery-focused plan** to ship the MVP quickly using **Next.js (App Router) for frontend** + **Express.js (Node.js) backend APIs** on **MongoDB Atlas**, while keeping the codebase **secure, smooth, and scalable** for a future React Native app.

---

## Goals (MVP by 15-05)

- **Fast MVP delivery**: core listing + profiles + inquiry + membership upgrade (Razorpay) + admin basics.
- **Great UX**: mobile-first, fast loading, WhatsApp-first flows.
- **SEO-first**: indexable listing/profile pages, sitemap, metadata, schema.
- **Secure by default**: strong auth, RBAC, validation, safe file uploads, payment verification.
- **Future-ready**: keep business logic reusable for React Native (API-first, shared types).

---

## Recommended Tech Stack (final)

- **Frontend**: Next.js (App Router), Tailwind CSS, component library (shadcn/ui or equivalent).
- **Backend**: Express.js (Node.js) REST APIs (service-based backend).
- **Database**: MongoDB Atlas + Mongoose.
- **Auth**: JWT + RBAC (prefer **Bearer token** for multi-client support; optionally httpOnly cookies for web-only routes).
- **Payments**: Razorpay Orders + webhook verification.
- **Uploads**: object storage (preferred: S3-compatible like Cloudflare R2 / AWS S3). If VPS-only: local storage with strict validation + CDN later.
- **Deployment**: VPS + Nginx + PM2 (two services: **Next.js frontend** + **Express API**; optional static/media bucket).

---

## Architecture Principles (to move fast + stay scalable)

- **Component-based UI**:
  - Build a small “design system” first: `Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `Pagination`, `Skeleton`.
  - Compose pages from reusable blocks: `SearchBar`, `CategoryGrid`, `BusinessCard`, `FeaturedCarousel`, `ProfileHeader`, `GalleryGrid`, `InquiryForm`.
- **Simple backend layering (thin controller → service → repository)**:
  - **Controller (Express route handler)**: only HTTP concerns (parse, auth/RBAC, call service, return response).
  - **Service**: business rules + orchestration (plan restrictions, ranking, membership activation).
  - **Repository**: database access only (Mongoose queries), no business logic.
  - Keep controllers small; avoid heavy “controller logic”. Reuse services across web + future mobile clients.
- **API-first**:
  - All business operations go through Express APIs (e.g. `/api/...`) with consistent response shape.
  - This enables **React Native** to reuse the same backend later with minimal changes.
- **Shared types/schemas**:
  - Use Zod schemas for request validation + inference for TypeScript types.
  - Keep a single source of truth for enums (roles, plans, inquiry status).
- **Feature flags by plan**:
  - Enforce Free vs Standard rules at the API level (not only UI).
- **SEO separation**:
  - Public pages are server-rendered for SEO.
  - Dashboards are authenticated and can be mostly client-side.

---

## MVP Scope (must-have)

### Public
- Homepage: search + categories + featured members + CTA.
- Listing pages: category + city, filters, pagination, ranking (Standard first).
- Business profile pages:
  - Free: basic info + WhatsApp/call.
  - Standard: gallery + reviews/ratings + catalogues.
- Inquiry form (lead capture) + WhatsApp click-to-chat.

### Auth + Dashboard
- Register/Login, logout, session persistence.
- Business dashboard:
  - Edit profile
  - Upload logo/gallery/catalogue
  - View inquiries/leads
  - Upgrade plan + membership status

### Admin
- Manage users/businesses
- Manage categories
- Manage memberships & payments
- Approve reviews
- Feature businesses / banners (minimal)

### Payments
- Plan list
- Create Razorpay order
- Verify payment (server-side)
- Activate membership + set expiry

---

## Time-boxed Execution Plan (high speed)

### Day 0 (today): repo + foundations (2–4 hrs)
- Next.js app setup + Tailwind + UI components.
- Project structure + env config + database connection.
- Zod validation utilities + API response helper.

### Day 1: data models + auth + RBAC
- Mongoose models: `User`, `BusinessProfile`, `Category`, `Inquiry`, `Membership`, `Payment`, `Review`, `Catalogue`, `Banner`.
- Auth routes: register/login/profile/logout.
- JWT in **httpOnly cookie** + RBAC guards.

### Day 2: public discovery (SEO pages)
- Homepage sections + search UX.
- Listings page with filters + pagination + ranking.
- Business profile page (free + standard views).
- SEO: meta, OG, schema (basic), sitemap placeholder.

### Day 3: dashboard + inquiries
- Business onboarding + profile edit.
- Inquiry create + business inquiry list.
- Basic admin: user/business listing + moderation actions.

### Day 4: Razorpay + membership activation
- Plan endpoints + upgrade flow.
- Payment verification + webhook.
- Membership expiry + plan-based feature enforcement.

### Day 5 (buffer to 15-05): polish + hardening
- Performance pass: image optimization, caching headers, minimize JS.
- Security hardening + audit checklist.
- Bug fixing + content placeholders + production config.

---

## File/Folder Structure (suggested)

- `apps/web/` (Next.js frontend)
  - `src/app/` routes/pages
  - `src/components/` UI + blocks + business components
  - `src/lib/` web utilities (formatting, constants)
- `apps/api/` (Express backend)
  - `src/routes/` express routes (controllers)
  - `src/services/` business logic
  - `src/repositories/` data access (Mongoose only)
  - `src/models/` mongoose schemas
  - `src/validators/` zod schemas
  - `src/middleware/` auth, rbac, rate limit, error handler
  - `src/lib/` shared api utilities (response helpers, constants)
  - `src/db/` connection

---

## Performance (smooth + fast)

- **Next Image** for logos/gallery + modern formats.
- **Server rendering** for SEO pages; avoid heavy client bundles.
- **Caching**:
  - Cache categories + featured lists (short TTL).
  - Consider a simple in-memory cache (VPS) for MVP.
- **Pagination everywhere**: listings, reviews, inquiries.
- **Indexes in MongoDB**:
  - `business_profiles`: `slug` (unique), `category`, `city`, `membershipType`, `verificationBadge`, `rating`
  - `inquiries`: `businessId`, `createdAt`
  - `reviews`: `businessId`, `createdAt`, `isApproved`
- **Search v1**: filter-based (category/city/services). Add Atlas Search later if needed.

---

## Security Checklist (must-do)

- **Auth**
  - Password hashing: bcrypt/argon2.
  - JWT for API clients (React Native ready): **Authorization: Bearer <token>**.
  - If using cookies on web: use **httpOnly** cookie + CSRF strategy.
  - Rate-limit auth endpoints.
- **RBAC**
  - Enforce roles/plan restrictions **server-side**.
  - Admin routes protected with explicit checks.
- **Validation**
  - Validate all inputs with Zod (body/query/params).
  - Sanitize rich text if allowed (or disallow HTML).
- **Uploads**
  - Allowlist file types, max size, virus scanning later.
  - Store outside web root; signed URLs if using object storage.
- **Payments**
  - Always verify Razorpay signature server-side.
  - Prefer webhooks for final activation status.
- **API hardening**
  - CORS locked to domain (if separate services).
  - Security headers, HTTPS only, CSRF strategy if needed (cookie auth).
- **Logging**
  - Don’t log secrets, tokens, or full payment payloads.

---

## React Native Future Scope (keep compatibility now)

- Keep **all business logic in APIs** (no “server-only” page hacks).
- Use consistent JSON shapes + versioning ready (`/api/v1/...` optional).
- Centralize shared types/schemas so mobile can mirror them.
- Prefer “resource” endpoints: businesses, categories, inquiries, reviews, plans, payments.

---

## Definition of Done (MVP)

- Public pages: homepage + listings + business profile are SEO-friendly and fast.
- Dashboard: businesses can manage profile, uploads, inquiries, and upgrade plan.
- Payments: Razorpay upgrade activates Standard membership correctly.
- Admin: can manage categories, businesses, payments, inquiries, reviews.
- Security: RBAC + validation + safe upload handling + payment verification in place.

