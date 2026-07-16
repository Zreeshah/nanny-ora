# NannyOra — Project Context Document

> **⚠️ Read `AGENTS.md` first.** This project runs **Next.js 16.2.9** (App Router) with breaking changes from training data. Before writing any Next.js code, consult `node_modules/next/dist/docs/` for the relevant guide.

This document is the authoritative reference for the NannyOra codebase — architecture, tech stack, data models, API surface, and conventions. Last updated: July 2026.

---

## 1. Project Overview

**NannyOra** is a premium, localized web platform connecting families in Auckland, New Zealand, with trusted, qualified, and specialist carers. The platform focuses on nannies with specialized training — sensory-aware care, neurodiverse support (autism/ADHD), Early Childhood Education (ECE), maternity/newborn care (月嫂), night nanny/overnight care, and inclusive neurodiverse care.

- **Production URL:** https://nanny-ora.vercel.app
- **Repo:** https://github.com/Zreeshah/nanny-ora
- **Hosted on:** Vercel (Node 24.x runtime)
- **Database:** Supabase Postgres (Neon-backed, pooled via PgBouncer)
- **File Storage:** Supabase Storage (private bucket `nanny-documents`, public bucket `nanny-photos`)

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 |
| Library | React + TypeScript | React 19.2.4 |
| Styling | Tailwind CSS v4 (`@theme inline` tokens) | ^4 |
| Database | PostgreSQL via Supabase | — |
| ORM | Prisma Client | ^6.19.3 |
| Auth | NextAuth.js v5 (Auth.js beta) — JWT, credentials provider | ^5.0.0-beta.31 |
| File Storage | Supabase Storage (`@supabase/supabase-js`) | ^2 |
| Form Validation | Zod | ^4.4.3 |
| Password Hashing | bcryptjs | ^3.0.3 |
| Icons | lucide-react | ^1.18.0 |
| Utilities | clsx + tailwind-merge | — |
| Email | Resend | ^6.16.0 |
| SMS | Twilio (plain REST, no SDK) | — |
| Payments | Stripe (SDK) + PayPal (plain REST) | ^22.3.1 |
| Server-only guard | `server-only` | ^0.0.1 |

### Build Scripts
```
npm run dev       → next dev --webpack
npm run build     → next build
npm run start     → next start
npm run lint      → eslint
npm run db:push   → prisma db push --skip-generate
npm run db:seed   → tsx prisma/seed.ts
npm test          → tsx src/lib/email/escape.test.ts src/lib/images.test.ts src/lib/moderation.test.ts src/lib/sms/normalise.test.ts
postinstall       → prisma generate
```

### Key Config
- **`next.config.ts`**: `serverActions.bodySizeLimit: "10mb"` (raised from 1MB default for document uploads); `images.remotePatterns` whitelists `images.pexels.com` and `**.supabase.co` (nanny profile photos)
- **Dev script uses `--webpack`** (not Turbopack), though `turbopack.root` is set in config
- **`postcss.config.mjs`** uses `@tailwindcss/postcss` (NOT the old `tailwindcss` PostCSS plugin — Tailwind v4)

---

## 3. Environment Variables

### Local `.env` (gitignored — never committed)
| Variable | Scope | Purpose |
|---|---|---|
| `DATABASE_URL` | Server | Pooled Supabase Postgres (pgbouncer, port 6543, `&pgbouncer=true&connection_limit=1&prepare=false`) |
| `DIRECT_URL` | Server | Direct Supabase Postgres (session-mode pooler, port 5432) — used by Prisma migrations/db push/seed |
| `NEXTAUTH_SECRET` | Server | NextAuth JWT signing secret |
| `NEXTAUTH_URL` | Server | App base URL |
| `AUTH_TRUST_HOST` | Server | `true` — trusts host header (required on Vercel) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Public** | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Public** | Supabase anon key (browser-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Supabase service role key (server uploads, admin signed URLs — NEVER expose to browser) |
| `RESEND_API_KEY` | Server-only | Resend API key for transactional emails (no-ops if unset) |
| `EMAIL_FROM` | Server-only | Default sender (default: `NannyOra <info@nannyora.co.nz>`) |
| `EMAIL_FROM_VERIFICATION` | Server-only | Vetting team sender (default: `NannyOra Vetting <verification@nannyora.co.nz>`) |
| `EMAIL_FROM_ADMIN` | Server-only | Admin sender (default: `NannyOra <admin@nannyora.co.nz>`) |
| `ADMIN_EMAIL` | Server-only | Comma-separated admin notification recipients (default: `admin@nannyora.co.nz,nannyora.agency@gmail.com`) |
| `ADMIN_BACKUP_EMAIL` | Server-only | Backup admin email — emergency access without DB (no default; unset = disabled) |
| `ADMIN_BACKUP_PASSWORD` | Server-only | Backup admin password — emergency access without DB (no default; unset = disabled) |
| `STRIPE_SECRET_KEY` | Server-only | Stripe API secret key (memberships, bookings, tiers) |
| `PAYPAL_CLIENT_ID` | Server-only | PayPal REST client ID (bookings, tiers, payouts) |
| `PAYPAL_CLIENT_SECRET` | Server-only | PayPal REST secret |
| `PAYPAL_ENV` | Server-only | `live` or `sandbox` (default sandbox) |
| `NEXT_PUBLIC_APP_URL` | **Public** | Absolute base URL for payment return links (falls back to `VERCEL_PROJECT_PRODUCTION_URL` / localhost) |
| `CRON_SECRET` | Server-only | Bearer token for `/api/cron/payouts` (Vercel Cron sends this) |
| `MEMBERSHIP_ENFORCED` | Server-only | `true` to gate member-only features. Off by default (soft-launch) |

### Vercel Production Env Vars
Set on Vercel project `nanny-ora` for the Production environment:
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_VERIFICATION`, `EMAIL_FROM_ADMIN`, `ADMIN_EMAIL`
- `ADMIN_BACKUP_EMAIL`, `ADMIN_BACKUP_PASSWORD`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`
- `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`
- `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`, `MEMBERSHIP_ENFORCED`

> **`AUTH_SECRET` is required** — `auth.ts` throws on startup if unset. No hardcoded fallback.

> The Vercel-Supabase integration also auto-provisions `POSTGRES_*` and `SUPABASE_*` vars — these are largely unused by the codebase. The app reads only the vars listed above.

---

## 4. User Roles & Pathways

### Parent/Family (`role: "PARENT"`)
- Registration intake at `/register-family` (captures suburb, child age ranges, care type needed, special needs)
- Dashboard at `/dashboard/parent` — stats, active enquiries, job posts, recommended nannies
- Can browse nannies at `/find-a-nanny`, post jobs at `/post-a-job`, send enquiries

### Nanny/Carer (`role: "NANNY"`)
- Application intake at `/apply-as-nanny` — a 4-step form:
  1. **Contact & Coverage** — name, email, phone, suburb, password, areas covered
  2. **Experience & Specialties** — years experience, hourly rate, care types, availability, qualifications, certifications, specialist tags
  3. **Safety & Vetting Checks** — upload documents for 5 of 7 checks (ID, work history, professional registration, referee details, police vet); 2 checks (interview, risk assessment) are admin-only
  4. **Biography & Final Review** — bio text, vetting summary, **Police Vetting Authorization agreement** (Children's Act 2014 — required checkbox), submit
- Dashboard at `/dashboard/nanny` — stats, matching jobs, recent enquiries, profile status, safety check progress
- Profile editor at `/dashboard/nanny/profile` — full profile editing + document upload/delete

### Admin (`role: "ADMIN"`)
- Dashboard at `/admin` — overview stats
- Nanny moderation at `/admin/nannies` — review applications, expand to see bio, 7-step vetting check audit, uploaded documents (with **Download button** that generates 5-minute Supabase Storage signed URLs), document approve/reject, safety check status management, verification level changes, application approve/suspend
- Job post management at `/admin/jobs`
- Enquiry management at `/admin/enquiries`

---

## 5. Authentication & Sessions

Handled by NextAuth.js v5 in `src/lib/auth/auth.ts`:
- **Strategy:** JWT (no database sessions)
- **Provider:** Credentials only (Email + Password, no OAuth)
- **Sign-in page:** `/login`
- **Token/Session callbacks:** expose `user.id` and `user.role` to client/server

### Demo Accounts & Emergency Access
There is **no universal password bypass** (the old `demo1234` fallback was removed in `073ba85`).
- The three demo accounts (admin@/emma@/parent@nannyora.co.nz, password `demo1234`) are ordinary
  **seeded DB users** with bcrypt hashes — they authenticate through the normal DB path and
  require the database to be reachable.
- **Emergency backup admin** (works without DB) exists ONLY when both `ADMIN_BACKUP_EMAIL` and
  `ADMIN_BACKUP_PASSWORD` env vars are set — fail closed, no hardcoded default in code.
  Credentials live in Vercel env vars / local `.env`, never in the repo.

All Prisma errors in `authorize()` are caught → returns `null` → login fails gracefully (no crash when DB is down).

### Route Protection (`src/proxy.ts`)
This is the middleware (named `proxy` per Next.js 16 convention). Uses `getToken` from `next-auth/jwt`:
- `/admin/*` → requires `role === "ADMIN"`, else redirect to `/login`
- `/dashboard/nanny/*` → requires `role === "NANNY"`
- `/dashboard/parent/*` → requires `role === "PARENT"`
- **Matcher:** `/admin/:path*`, `/dashboard/:path*`

---

## 6. Directory Structure

```text
nannyora/
├── prisma/
│   ├── schema.prisma          # PostgreSQL schema (8 models)
│   ├── seed.ts                # No-op (demo data removed; real accounts only)
│   └── dev.db                 # Local SQLite (gitignored, legacy)
├── public/
│   ├── logo-wordmark.png      # Clean wordmark logo (no baked-in tagline)
│   ├── logo.png               # Legacy logo with baked-in tagline (unused)
│   ├── logo.jpg               # Legacy logo variant
│   └── logo-circle.jpg        # Circular brand badge
│   └── images/                # 34 contextual Auckland childcare photos (tagged library)
├── src/
│   ├── proxy.ts               # Route guard middleware (role-based access control)
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (fonts, metadata, Providers wrapper)
│   │   ├── globals.css        # Tailwind v4 theme + design system
│   │   ├── login/page.tsx     # Custom NextAuth sign-in form (CLIENT)
│   │   ├── forgot-password/page.tsx  # Password reset request form (CLIENT)
│   │   ├── reset-password/page.tsx   # Set new password with token (CLIENT)
│   │   ├── icon.png, apple-icon.png, favicon.ico  # Brand favicon (tan heart on navy)
│   │   ├── robots.ts            # robots.txt (disallow /dashboard, /admin, /api, login routes)
│   │   ├── sitemap.ts           # sitemap.xml (static + suburb SEO pages + approved nanny profiles)
│   │   ├── opengraph-image.tsx  # Dynamic OG image (NannyOra brand, ImageResponse)
│   │   ├── api/auth/[...nextauth]/route.ts  # Auth handlers (3 lines)
│   │   ├── api/webhooks/stripe/route.ts     # Stripe webhook (membership + booking + tier activation)
│   │   ├── api/webhooks/paypal/route.ts     # PayPal webhook (membership + booking + tier activation)
│   │   ├── api/cron/payouts/route.ts        # Daily payout cron (CRON_SECRET-gated, releases due nanny earnings)
│   │   ├── (public)/          # Public marketing + listing pages
│   │   │   ├── layout.tsx     # Shared public layout
│   │   │   ├── page.tsx       # Homepage (SERVER)
│   │   │   ├── apply-as-nanny/page.tsx + layout.tsx    # Nanny application form (CLIENT, 844 lines)
│   │   │   ├── register-family/page.tsx + layout.tsx  # Parent registration (CLIENT)
│   │   │   ├── find-a-nanny/page.tsx             # Nanny directory wrapper (SERVER, 16 lines, metadata + revalidate=300)
│   │   │   ├── find-a-nanny/FindANannyClient.tsx # Filter sidebar + results grid (CLIENT, 455 lines)
│   │   │   ├── post-a-job/page.tsx + layout.tsx  # Job posting form (CLIENT)
│   │   │   ├── membership/page.tsx + PlanCards.tsx  # Parent membership plans (SERVER + CLIENT)
│   │   │   ├── pricing/page.tsx           # Pricing (SERVER)
│   │   │   ├── how-it-works/page.tsx      # How it works (SERVER)
│   │   │   ├── trust-and-safety/page.tsx  # Trust & safety (SERVER)
│   │   │   ├── verification-process/page.tsx  # Detailed 7-layer verification process (SERVER, 232 lines)
│   │   │   ├── childcare-support/page.tsx    # Childcare support options info page (SERVER, 81 lines)
│   │   │   ├── nannies/[id]/page.tsx      # Nanny detail (SERVER, slug-based URL + cuid fallback)
│   │   │   ├── nannies/[id]/BookingWidget.tsx  # Booking date/hours/payment widget (CLIENT)
│   │   │   ├── nannies/[id]/EnquiryForm.tsx  # Parent enquiry sidebar form (CLIENT, 107 lines)
│   │   │   ├── nannies/[id]/ViewTracker.tsx  # Invisible view-tracking pixel (CLIENT, 12 lines)
│   │   │   ├── nannies/auckland/page.tsx  # SEO listing (SERVER)
│   │   │   ├── nannies/auckland/[suburb]/page.tsx  # Dynamic suburb SEO (SERVER)
│   │   │   ├── ece-nanny-auckland/page.tsx             # SEO landing (SERVER)
│   │   │   ├── neurodiverse-childcare-auckland/page.tsx # SEO landing (SERVER)
│   │   │   ├── sensory-aware-nanny-auckland/page.tsx   # SEO landing (SERVER)
│   │   │   └── specialist-childcare-auckland/page.tsx  # SEO landing (SERVER)
│   │   ├── admin/             # Admin area (role-guarded)
│   │   │   ├── layout.tsx     # Admin shell with dark header + logo-wordmark (CLIENT)
│   │   │   ├── page.tsx       # Warm operations-center dashboard with KPIs, funnel, activity feed (SERVER, 346 lines)
│   │   │   ├── nannies/page.tsx  # Nanny moderation — warm card design (CLIENT, 519 lines)
│   │   │   ├── jobs/page.tsx     # Job management — warm card design (CLIENT)
│   │   │   ├── enquiries/page.tsx # Enquiry inbox — parent→nanny flow, flagged badges (CLIENT)
│   │   │   ├── enquiries/[id]/page.tsx # Admin conversation viewer (CLIENT, ConversationThread wrapper)
│   │   │   └── money/page.tsx     # Admin money dashboard — revenue, payouts, recent payments (CLIENT)
│   │   └── dashboard/         # User dashboards (role-guarded)
│   │       ├── layout.tsx     # Shared dashboard shell — unread message badge in nav (CLIENT)
│   │       ├── nanny/page.tsx # Nanny dashboard — live stats from getNannyDashboard (CLIENT)
│   │       ├── nanny/enquiries/page.tsx    # Nanny message inbox (ConversationList wrapper)
│   │       ├── nanny/enquiries/[id]/page.tsx # Nanny conversation thread (ConversationThread wrapper)
│   │       ├── nanny/bookings/page.tsx     # Nanny bookings list (CLIENT)
│   │       ├── nanny/tier/page.tsx + TierCards.tsx  # Nanny tier purchase ($50/$200) (SERVER + CLIENT)
│   │       ├── nanny/profile/page.tsx      # Profile editor wrapper (SERVER, 133 lines)
│   │       ├── nanny/profile/ProfileForm.tsx # Profile editor form (CLIENT, 816 lines)
│   │       ├── parent/page.tsx # Parent dashboard — live stats from getParentDashboard (CLIENT)
│   │       ├── parent/messages/page.tsx    # Parent message inbox (ConversationList wrapper)
│   │       ├── parent/messages/[id]/page.tsx # Parent conversation thread (ConversationThread wrapper)
│   │       ├── parent/bookings/page.tsx   # Parent bookings list (CLIENT)
│   │       ├── parent/membership/page.tsx + MembershipPanel.tsx  # Parent membership management (SERVER + CLIENT)
│   │       └── parent/profile/page.tsx # Parent profile editor (CLIENT, 142 lines)
│   ├── components/
│   │   ├── providers/Providers.tsx   # SessionProvider + ToastProvider
│   │   ├── layout/                   # Header, Footer, MobileBottomNav
│   │   ├── cards/NannyCard.tsx       # Nanny listing card (shows PlacementBadge when not AVAILABLE)
│   │   ├── cards/FavouriteButton.tsx # Optimistic heart toggle (PARENT only, member-gated)
│   │   ├── booking/BookingsClient.tsx # Shared bookings list + status actions (nanny/parent)
│   │   ├── membership/UpgradeGate.tsx  # Upgrade modal — shown when action returns upgradeRequired
│   │   ├── seo/JsonLd.tsx             # Injects schema.org JSON-LD into page <head>
│   │   ├── FaqGroups.tsx             # Grouped parent + nanny FAQ (reused on home + how-it-works)
│   │   ├── home/                     # InteractiveHero, BentoFeatures, MarqueeTestimonials, StatsTicker, TrustStrip, TrustStandard, SpecialistExpertise, DayInLife, LifestyleGallery
│   │   ├── messaging/                # ConversationList (inbox), ConversationThread (chat view)
│   │   └── ui/                       # Button, Input, Select, Textarea, Card, Badge (+VerificationBadge +PlacementBadge +SpecialistTag), Accordion, Toast (+useToast hook), Reveal, ShinyText, BorderBeam, ImageBand, TagInput, SuburbAutocomplete
│   ├── lib/
│   │   ├── utils.ts                  # cn(), formatRate(), getInitials()
│   │   ├── constants/index.ts        # All enums, lists, options (care types, safety checks, regions, language tags, placement statuses, etc.)
│   │   ├── validations/index.ts      # Zod schemas (parentIntake, nannyApplication, jobPost, enquiry, referee)
│   │   ├── auth/auth.ts             # NextAuth config
│   │   ├── db/prisma.ts             # Prisma client singleton
│   │   ├── supabase/server.ts       # Server Supabase client (service role key) — browser client deleted
│   │   ├── email/                    # Resend lifecycle email system (sendEmail + 13 lifecycle templates + escapeHtml + emailShell)
│   │   ├── sms/                      # Twilio SMS via plain REST (sendSms) + NZ phone normaliser (toE164NZ)
│   │   ├── moderation.ts            # detectContactInfo() — flags email/phone in messages (de-obfuscates "at"/"dot"/spelled digits)
│   │   ├── suburbs.ts               # ~160 Auckland suburbs by region + normSuburb/titleCaseSuburb/regionOf/suburbMatches — source of truth for suburb→region
│   │   ├── faq.ts                    # parentFaqs (4) + nannyFaqs (5) — payroll, employment, holidays, privacy Q&A
│   │   ├── images.ts                # Tagged local image library + pickImages() deterministic seeded picker
│   │   ├── slug.ts                  # slugify(name) → "jessie-wu" (accent-stripping), looksLikeCuid() — pure, client+server
│   │   ├── seo.ts                   # schema.org builders: Organization, WebSite, ChildCare LocalBusiness, Breadcrumb, Person (nanny), FAQPage
│   │   ├── booking.ts              # PURE booking logic (client+server): SERVICE_FEE_PCT=0.1, quoteBooking(), BookingStatus workflow + transitions, self-check
│   │   ├── membership.ts           # Plans (MONTHLY/QUARTERLY/ANNUAL), MEMBERSHIP_BENEFITS, getMembership(), requireMembership() gate (MEMBERSHIP_ENFORCED soft-launch)
│   │   ├── tiers.ts                # NANNY_TIERS (LISTED $50 / PREMIUM $200), tierRank() — pure, client+server
│   │   ├── payments/                # Provider-agnostic payment layer
│   │   │   ├── index.ts             # getProvider(), configuredProviders(), appUrl() — provider registry
│   │   │   ├── types.ts             # PaymentProvider interface, ProviderId, CheckoutRequest variants
│   │   │   ├── stripe.ts            # Stripe provider (SDK): memberships, bookings, tiers, refundStripe()
│   │   │   ├── paypal.ts            # PayPal provider (plain REST): memberships, bookings, tiers, captureBookingOrder(), refundPaypalCapture(), sendPayout()
│   │   │   └── activate.ts         # activateMembership(), recordPayment(), deactivateMembership() — webhook handlers call these
│   │   └── data/nannies.ts          # DB-backed public nanny directory (getPublicNannies tier-sorted, getPublicNannyById slug+cuid, getNannyReviews, filterNannies, NannyFilters) — no sample fallback, returns [] on DB error
│   └── server/actions/              # Server Actions (all use "use server")
│       ├── auth.ts                  # Exports ActionResult type (+ upgradeRequired flag) — registerUser deleted; signups via registerParent/applyAsNanny
│       ├── nanny.ts                 # applyAsNanny (+uniqueNannySlug), updateNannyProfile, uploadNannyDocument, deleteNannyDocument, getNannyDocuments, uploadProfilePhoto, setProRegApplicability
│       ├── parent.ts                # registerParent, updateParentProfile, getMyParentProfile
│       ├── job.ts                   # createJobPost (member-gated), updateJobStatus, getJobPosts, applyToJob
│       ├── enquiry.ts               # createEnquiry (member-gated), updateEnquiryStatus, getEnquiries
│       ├── engagement.ts            # toggleFavourite (member-gated), getFavouriteIds, recordProfileView, getNannyDashboard, getParentDashboard, getMyNannyEnquiries
│       ├── messages.ts              # getConversation (member-gated), sendMessage (member-gated), getMyConversations, getUnreadTotal
│       ├── password.ts              # requestPasswordReset, resetPassword
│       ├── reviews.ts               # createReview
│       ├── booking.ts               # createBooking (member-gated), cancelBooking, acceptBooking, declineBooking, completeBooking, approveBooking, getMyBookings, getNannyBookings
│       ├── membership.ts            # startMembershipCheckout, cancelMembership, getPaymentOptions, getMyMembership
│       ├── tier.ts                  # startTierCheckout, getMyTier
│       ├── payouts.ts                # releaseDuePayouts(limit=50) — called by cron; idempotent, claim-then-send pattern
│       ├── money.ts                 # getMoneyOverview (ADMIN) — revenue, payouts owed/paid, recent payments, counts
│       └── admin.ts                 # updateNannyStatus, updateVerificationLevel, reviewDocument, updateSafetyCheckStatus, getAdminStats, getAdminNannies, getDocumentDownloadUrl, updatePlacement
├── next.config.ts                   # serverActions.bodySizeLimit: 10mb, images, turbopack
├── vercel.json                      # Vercel Cron: /api/cron/payouts daily at 03:00 UTC
├── postcss.config.mjs              # @tailwindcss/postcss (Tailwind v4)
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── AGENTS.md                        # Next.js 16 rules (READ BEFORE CODING)
├── CLAUDE.md                        # References @AGENTS.md
└── .gitignore
```

---

## 7. Database Schema (Prisma)

**Datasource:** PostgreSQL (Supabase). `url = env("DATABASE_URL")` (pooled), `directUrl = env("DIRECT_URL")` (direct for migrations).

### Models (16 total: User, Membership, Payment, Booking, ParentProfile, NannyProfile, NannyDocument, JobPost, Enquiry, Message, ConversationRead, JobApplication, Review, SkillTag, Favourite, ProfileView)

#### `User` → table `users`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `email` | String | Unique |
| `passwordHash` | String | bcrypt |
| `name` | String | |
| `phone` | String? | |
| `role` | String | Default "PARENT" — PARENT/NANNY/ADMIN |
| `image` | String? | |
| `resetTokenHash` | String? | SHA-256 hash of password reset token (raw token never stored) |
| `resetTokenExpiry` | DateTime? | 1-hour TTL; cleared on use |
| `createdAt` / `updatedAt` | DateTime | |

Relations: `parentProfile?`, `nannyProfile?`, `jobPosts[]`, `enquiriesSent[]`, `reviewsGiven[]`, `favourites[]` (FavouritesByParent), `profileViews[]` (ViewsByUser), `messagesSent[]` (MessagesSent), `conversationReads[]` (ConversationReads), `membership?` (1:1), `payments[]` (PaymentsByUser), `bookings[]` (BookingsByParent — parent owns bookings)

#### `ParentProfile` → table `parent_profiles`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `userId` | String | Unique FK→User (cascade) |
| `suburb` | String | |
| `childAgeRange` | String | JSON-stringified array |
| `careTypeNeeded` | String | JSON-stringified array |
| `preferredDays` | String | |
| `startDate` | String? | |
| `specialistNeeds` | String | Default "" |
| `notes` | String | Default "" |

#### `NannyProfile` → table `nanny_profiles` (core model, ~48 fields)
| Field Group | Fields | Notes |
|---|---|---|
| Identity | `id`, `userId` (unique FK→User), `slug` (unique?, name-based permalink e.g. "jessie-wu"), `profileImageUrl?` | `slug` null until `applyAsNanny` assigns via `uniqueNannySlug(name)`; old cuid links still resolve via `OR` lookup |
| Location | `suburb`, `areasCovered` (JSON string) | |
| Experience | `yearsExperience` (Int), `hourlyRate` (Int), `bio` | |
| Care types | `careTypes` (JSON string), `qualifications` (JSON string) | |
| Availability | `availability` (JSON string), `availabilitySummary` | |
| Specialist tags | `specialistTags` (JSON string) | |
| Languages | `languages` (JSON string, default `"[]"`) | Mandarin/Cantonese/Korean/Japanese/Spanish/Te Reo Māori |
| Boolean flags | `eceExperience`, `neurodiverseExperience`, `firstAidCurrent`, `driverLicence` | |
| Referee data | `refereeData` (JSON string of `{name, phone, email, relationship}[]`) | |
| Verification | `verificationLevel` (default "LISTED") | LISTED/VERIFIED/PREMIUM_VETTED/SPECIALIST |
| Admin status | `adminStatus` (default "SUBMITTED") | DRAFT/SUBMITTED/UNDER_REVIEW/APPROVED/VERIFIED/SPECIALIST/SUSPENDED/ARCHIVED |
| **7 Safety checks** | `identityVerified`, `workHistoryVerified`, `proRegVerified`, `refereeCheckStatus`, `policeVetStatus`, `interviewStatus`, `riskAssessmentStatus` | Each: NOT_STARTED/SUBMITTED/VERIFIED/REJECTED/**NOT_APPLICABLE** (NOT_APPLICABLE only offered for `proRegVerified`) |
| **Police vet auth** | `policeVetAuthorized` (Boolean), `policeVetAuthorizedAt` (DateTime?) | Children's Act 2014 consent |
| **Pricing tier** | `tier` (default "NONE"), `tierPaidAt` (DateTime?) | NONE/LISTED ($50)/PREMIUM ($200 incl. First Aid). One-time upfront, no monthly fee. `tierRank()` orders search: Premium > Listed > unpaid |
| **Payout** | `payoutPaypalEmail` (String?) | Where booking earnings are auto-paid (PayPal Payouts); null = held until added |
| **Placement** | `placementStatus` (default "AVAILABLE"), `trialDate?`, `placementStart?`, `placementEnd?`, `placementNote?`, `paidConfirmed` (Boolean, default false) | Admin-managed availability. AVAILABLE/TRIAL_PENDING/PLACED/CONTRACT_ENDING. `paidConfirmed` is internal, never public |
| Timestamps | `createdAt`, `updatedAt` | |
| Engagement | `favouritedBy` (Favourite[]), `views` (ProfileView[]), `jobApplications[]`, `bookings[]` (BookingsOfNanny) | Relations |

> **JSON-as-string pattern:** Arrays (careTypes, availability, specialistTags, areasCovered, refereeData, languages, etc.) are stored as `JSON.stringify()` strings in `String` columns, not native Postgres arrays. Read/write code must `JSON.parse()` / `JSON.stringify()`.

#### `Membership` → table `memberships` (NEW — parent subscriptions, provider-agnostic)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `userId` | String | Unique FK→User (cascade) — 1:1 |
| `plan` | String | Default "MONTHLY" — MONTHLY/QUARTERLY/ANNUAL |
| `status` | String | Default "INACTIVE" — ACTIVE/PAST_DUE/CANCELED/EXPIRED/INACTIVE |
| `provider` | String? | STRIPE/PAYPAL (which provider holds the money relationship) |
| `providerCustomerId` | String? | Stripe customer or PayPal payer id |
| `providerSubscriptionId` | String? | Provider subscription id (for cancel-at-period-end) |
| `currentPeriodEnd` | DateTime? | "Renewal date" shown in dashboard |
| `cancelAtPeriodEnd` | Boolean | Default false |
| `createdAt` / `updatedAt` | DateTime | |

`@@index([status])`. A member is `status === "ACTIVE"` AND `currentPeriodEnd` not past. Activation only happens in the verified webhook (Stripe/PayPal), never on the success URL — a user can't self-grant access.

#### `Payment` → table `payments` (NEW — one row per charge; doubles as invoice/history)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `userId` | String | FK→User ("PaymentsByUser", cascade) |
| `kind` | String | MEMBERSHIP/BOOKING/DEPOSIT/PLACEMENT |
| `provider` | String | STRIPE/PAYPAL |
| `providerRef` | String? | Unique — checkout session / order / invoice id (idempotency key) |
| `amountCents` | Int | Gross charged |
| `feeCents` | Int | Default 0 — platform service fee portion (bookings only) |
| `currency` | String | Default "NZD" |
| `status` | String | Default "PENDING" — PENDING/PAID/FAILED/REFUNDED |
| `description` | String | Default "" |
| `bookingId` | String? | FK→Booking (SetNull) — links booking payment to its booking |
| `createdAt` / `updatedAt` | DateTime | |

`@@index([userId])`. Covers memberships now, bookings next, deposits/placements later.

#### `Booking` → table `bookings` (NEW — parent books nanny hours; funds held then auto-paid)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `parentId` | String | FK→User ("BookingsByParent", cascade) |
| `nannyId` | String | FK→NannyProfile ("BookingsOfNanny", cascade) |
| `date` | String | yyyy-mm-dd (matches JobPost.startDate convention) |
| `startTime` | String | Default "" |
| `hours` | Int | MIN_BOOKING_HOURS (1) … MAX_BOOKING_HOURS (12) |
| `hourlyRate` | Int | Snapshot of nanny's rate at booking time (NZD/hr, cents-free like NannyProfile) |
| `subtotalCents` | Int | rate × hours — what PARENT pays (no surcharge) |
| `feeCents` | Int | Platform's 10% cut (`SERVICE_FEE_PCT`), deducted from nanny earnings |
| `totalCents` | Int | == subtotalCents (amount charged to parent) |
| `status` | String | Default "REQUESTED" — see workflow below |
| `payoutStatus` | String | Default "HELD" — HELD/RELEASED/REFUNDED |
| `payoutReleaseAt` | DateTime? | Set on parent approval = completedAt + `PAYOUT_HOLD_HOURS` (48h) |
| `payoutRef` | String? | PayPal Payouts batch id (idempotency — one payout per booking) |
| `notes` | String | Default "" |
| `payments` | Payment[] | Relation |
| `createdAt` / `updatedAt` | DateTime | |

`@@index([parentId])`, `@@index([nannyId])`, `@@index([status])`.

**Booking status workflow:** `PENDING_PAYMENT → REQUESTED → ACCEPTED → UPCOMING → IN_PROGRESS → COMPLETED_BY_NANNY → AWAITING_PARENT_APPROVAL → COMPLETED → REVIEW_REQUESTED` (plus `DECLINED`, `CANCELLED`). `BOOKING_TRANSITIONS` in `booking.ts` enforces who (nanny/parent) can move to which next status via `canTransition(from, to, role)`.

**Fee model (fee-from-earnings):** Parent pays subtotal; 10% fee comes OUT of nanny's earnings. Nanny nets `subtotal − fee`. `quoteBooking(rate, hours)` is the single source — pure, client+server.

#### `NannyDocument` → table `nanny_documents`
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `nannyProfileId` | String | FK→NannyProfile (cascade) |
| `documentType` | String | ID/REFERENCES/FIRST_AID_CERT/POLICE_VET/TEACHER_REGISTRATION/WORK_HISTORY/PROFESSIONAL_REGISTRATION/REFEREE_LETTER |
| `fileName` | String | Original upload filename |
| `fileUrl` | String? | Supabase Storage path (e.g. `userId/timestamp-random-sanitized-name.pdf`) |
| `reviewStatus` | String | Default "PENDING" — PENDING/APPROVED/REJECTED |
| `reviewedAt` | DateTime? | |
| `reviewedBy` | String? | Admin user ID |
| `createdAt` | DateTime | |

#### `JobPost` → table `job_posts`
| Field | Type | Notes |
|---|---|---|
| `id`, `parentId` (FK→User) | String | |
| `title`, `suburb`, `careType` | String | |
| `daysRequired`, `childAges`, `startDate` | String | |
| `childCount` (Int), `hourlyBudget` (Int) | | |
| `specialistSupport`, `description` | String | |
| `status` | String | Default "PENDING" — PENDING/APPROVED/CLOSED/REJECTED |
| `contactEmail`, `contactPhone?` | String | |
| `applications` | JobApplication[] | Relation |

#### `Enquiry` → table `enquiries` (now a conversation thread, not a one-shot message)
| Field | Type | Notes |
|---|---|---|
| `id`, `parentId` (FK→User), `nannyId` (FK→NannyProfile) | String | |
| `message` | String | Seed message from parent (first message in thread) |
| `flagged` | Boolean | Default false — seed message contains contact info (email/phone) |
| `contactEmail` | String? | Admin-only visibility — never exposed to nanny |
| `contactPhone` | String? | Admin-only visibility |
| `status` | String | Default "NEW" — NEW/CONTACTED/MATCHED/CLOSED |
| `messages` | Message[] | Thread replies |
| `reads` | ConversationRead[] | Per-user read markers (unread counts) |
| `createdAt`, `updatedAt` | DateTime | `updatedAt` bumped on each new message → "last activity" |

#### `Message` → table `messages` (NEW — two-way chat replies within enquiry threads)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `enquiryId` | String | FK→Enquiry (cascade) |
| `senderId` | String | FK→User (MessagesSent, cascade) |
| `body` | String | Max 2000 chars |
| `flagged` | Boolean | Default false — contains contact info (email/phone) |
| `createdAt` | DateTime | |

`@@index([enquiryId])`.

#### `ConversationRead` → table `conversation_reads` (NEW — per-user read markers)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `enquiryId` | String | FK→Enquiry (cascade) |
| `userId` | String | FK→User (ConversationReads, cascade) |
| `lastReadAt` | DateTime | Default now() — updated when user opens the conversation |

`@@unique([enquiryId, userId])`.

#### `JobApplication` → table `job_applications` (NEW — nanny one-click applications to approved jobs)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `jobId` | String | FK→JobPost (cascade) |
| `nannyProfileId` | String | FK→NannyProfile (cascade) |
| `status` | String | Default "PENDING" — PENDING/ACCEPTED/DECLINED (admin-managed) |
| `createdAt` | DateTime | |

`@@unique([jobId, nannyProfileId])` — one application per nanny per job.

#### `Review` → table `reviews` (now active — was placeholder for Phase 2)
| Field | Type | Notes |
|---|---|---|
| `id`, `parentId` (FK→User "ReviewsGiven"), `nannyId` (FK→NannyProfile "ReviewsReceived") | String | |
| `rating` | Int | 1–5 (default 5) |
| `comment` | String | Max 1000 chars |
| `createdAt` | DateTime | |

`@@unique([parentId, nannyId])` — one review per parent per nanny (upsert updates existing). Gated on having an enquiry with that nanny in MATCHED or CLOSED status.

#### `SkillTag` → table `skill_tags`
| Field | Type | Notes |
|---|---|---|
| `id`, `name` (unique), `category` (default "general") | String | general/specialist/qualification |

#### `Favourite` → table `favourites` (NEW)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `parentId` | String | FK→User ("FavouritesByParent", cascade) |
| `nannyId` | String | FK→NannyProfile ("FavouritesOfNanny", cascade) |
| `createdAt` | DateTime | |

`@@unique([parentId, nannyId])` — one save per parent per nanny.

#### `ProfileView` → table `profile_views` (NEW)
| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | PK |
| `nannyId` | String | FK→NannyProfile ("ViewsOfNanny", cascade) |
| `viewerId` | String? | FK→User ("ViewsByUser", onDelete: SetNull) — null for anonymous views |
| `createdAt` | DateTime | |

`@@index([nannyId])`, `@@index([viewerId])`.

---

## 8. File Storage (Supabase Storage)

### Bucket: `nanny-documents` (private)
- Created via Supabase Management API
- **Private bucket** — no public URLs. Files only accessible via service_role key or signed URLs.
- No RLS policies needed — all uploads happen server-side using the service_role key.

### Upload Flow (Nanny Application Form)
1. Nanny selects files via `<input type="file">` in the apply-as-nanny form
2. On submit, `File` objects are passed to the `applyAsNanny` server action (Next.js Server Actions serialize File objects via RSC protocol)
3. Server action uploads each file to Supabase Storage using `supabaseServer.storage.from("nanny-documents").upload(path, arrayBuffer)`
4. Storage path stored as `NannyDocument.fileUrl`

### Upload Flow (Nanny Dashboard Profile)
1. Nanny selects file in the ProfileForm (`/dashboard/nanny/profile`)
2. `File` object passed to `uploadNannyDocument(documentType, file)` server action
3. Server action uploads to Storage at `{userId}/{timestamp}-{random}-{sanitized-name}`
4. DB record created with `fileUrl = storagePath`

### Download Flow (Admin)
1. Admin clicks Download button in `/admin/nannies`
2. `getDocumentDownloadUrl(documentId)` server action called
3. Server verifies admin role, fetches `NannyDocument.fileUrl` from DB
4. Generates **5-minute signed URL** via `supabaseServer.storage.from("nanny-documents").createSignedUrl(path, 300)`
5. Client opens signed URL in new tab

### Bucket: `nanny-photos` (public, NEW)
- Public bucket — profile photos served directly via URL.
- Upload path: `photos/{userId}.{ext}` (stable path, `upsert: true` for replaces).
- Stored URL includes `?v={timestamp}` cache-bust query param.
- Validation: JPG/PNG/WebP only, 5MB max.
- Photos are live immediately with no moderation — admin recourse is suspending the profile.
- `next.config.ts` whitelists `**.supabase.co` for `next/image`.

### Upload Flow (Profile Photo)
1. Nanny selects file in `/dashboard/nanny/profile` ProfileForm
2. `File` object passed to `uploadProfilePhoto(file)` server action
3. Server validates type (JPG/PNG/WebP) + 5MB max, uploads to `nanny-photos` bucket with `upsert: true`
4. `NannyProfile.profileImageUrl` updated with public URL + cache-bust param

---

## 9. Server Actions API

All server actions use `"use server"` directive and return `ActionResult` type:
```typescript
type ActionResult = { success: boolean; error?: string; data?: any; upgradeRequired?: boolean };
```
`upgradeRequired` is set when the action failed only because the user isn't a member — the UI shows the `UpgradeGate` modal instead of an error toast.

### Membership Gate (`src/lib/membership.ts` — not a server action, but the choke point all member-only actions call)
- `requireMembership()` — server-side gate. Returns `null` when allowed, or `{ success: false, error, upgradeRequired: true }` to return straight from the action. Checks: signed in → `MEMBERSHIP_ENFORCED` (off = no one gated, soft-launch) → role (ADMIN/NANNY never blocked) → `getMembership().isMember`. Every member-only server action calls this first.
- `MEMBERSHIP_ENFORCED` env var — master switch. OFF by default so the system ships and tests in production WITHOUT locking existing free parents out. Flip to `true` (no redeploy) to enforce.

### Auth (`src/lib/auth/auth.ts`)
Exports only the `ActionResult` type. `registerUser` was deleted — signups now flow through `registerParent` and `applyAsNanny`.

**NextAuth config:** JWT session with `maxAge: 7 days`. `AUTH_SECRET` is required (throws on startup if unset — no hardcoded fallback). Emergency backup admin account works without DB (credentials via `ADMIN_BACKUP_EMAIL` / `ADMIN_BACKUP_PASSWORD` env vars). The old `demo1234` universal password bypass was removed.

### Nanny (`src/server/actions/nanny.ts`)
| Function | Auth | Description |
|---|---|---|
| `applyAsNanny(input)` | Public | Validates, checks existing email, hashes password, validates doc files (5MB max, PDF/JPG/PNG/WebP), uploads docs to Supabase Storage, transactionally creates User + NannyProfile + NannyDocuments. Assigns unique name-slug via `uniqueNannySlug(name)`. Stores police vet authorization. Sends welcome + admin notification emails |
| `updateNannyProfile(updates)` | NANNY | Transactionally updates User (name/phone) + upserts NannyProfile |
| `uploadNannyDocument(documentType, file)` | NANNY | Validates file (5MB max, PDF/JPG/PNG/WebP), uploads File to Storage, creates NannyDocument, auto-updates safety check status |
| `deleteNannyDocument(documentId)` | NANNY | Verifies ownership, deletes PENDING docs only (DB record, not Storage file) |
| `getNannyDocuments()` | NANNY | Returns all documents for logged-in nanny |
| `uploadProfilePhoto(file)` | NANNY | Uploads/replaces profile photo to public `nanny-photos` bucket. Validates type (JPG/PNG/WebP) + 5MB max. Cache-bust on replace |
| `setProRegApplicability(notApplicable)` | NANNY | Toggles `proRegVerified` between NOT_STARTED and NOT_APPLICABLE (only; never clobbers submitted/verified) |

### Parent (`src/server/actions/parent.ts`)
| Function | Auth | Description |
|---|---|---|
| `registerParent(input)` | Public | Zod validates, creates User (PARENT) + ParentProfile, sends welcome + admin notification emails |
| `updateParentProfile(data)` | PARENT | Updates ParentProfile fields |
| `getMyParentProfile()` | PARENT | Returns current parent's profile (parses JSON arrays) |

### Job (`src/server/actions/job.ts`)
| Function | Auth | Description |
|---|---|---|
| `createJobPost(input)` | Logged in (any role) + member-gated | Creates JobPost (PENDING), emails admin |
| `updateJobStatus(jobId, status)` | ADMIN | Updates status, emails parent |
| `getJobPosts(filters?)` | ADMIN | Returns job posts with optional filters. `take: 50` limit. Includes parent email PII + applications (with nanny names, `take: 20`) |
| `applyToJob(jobId)` | NANNY | One-click application to an APPROVED job. Idempotent per (job, nanny). Notifies admin |

### Enquiry (`src/server/actions/enquiry.ts`)
| Function | Auth | Description |
|---|---|---|
| `createEnquiry(input)` | Logged in (any role) + member-gated | Zod validates, flags contact info via `detectContactInfo()`, creates Enquiry (status NEW, `flagged` field), stores `contactEmail`/`contactPhone` (admin-only), emails parent receipt + notifies admin |
| `updateEnquiryStatus(enquiryId, status)` | ADMIN | Updates status, emails parent |
| `getEnquiries(filters?)` | ADMIN | Returns enquiries with optional filters. `take: 50` limit. Includes parent name + email PII + flagged message counts |

### Engagement (`src/server/actions/engagement.ts`) (NEW)
| Function | Auth | Description |
|---|---|---|
| `toggleFavourite(nannyId)` | PARENT + member-gated | Saves/unsaves a nanny. Returns `{ favourited: boolean }` |
| `getFavouriteIds()` | Soft (returns `[]` if no session) | Returns parent's saved nanny IDs for heart UI hydration |
| `recordProfileView(nannyId)` | None (anonymous OK) | Best-effort view tracking. 30s throttle per nannyId (in-memory). NannyId existence check. Demo + backup admin IDs stored as null viewerId |
| `getNannyDashboard()` | Soft | Aggregates: profile views, new/recent enquiries, matching jobs, 7 safety checks, verification level, review count + avg rating |
| `getParentDashboard()` | Soft | Aggregates: enquiries sent, active jobs, carers viewed, saved nannies (`take: 50`), recommended nannies, family profile |
| `getMyNannyEnquiries()` | NANNY | All enquiries received by the nanny, including parent name + email. `take: 50` limit |

### Admin (`src/server/actions/admin.ts`)
| Function | Auth | Description |
|---|---|---|
| `updateNannyStatus(nannyProfileId, adminStatus)` | ADMIN | Updates adminStatus, emails nanny via `sendVerificationUpdate` |
| `updateVerificationLevel(nannyProfileId, level)` | ADMIN | Sets verification level, emails nanny |
| `reviewDocument(documentId, reviewStatus)` | ADMIN | Approves/rejects document, stamps `reviewedAt` + `reviewedBy` |
| `updateSafetyCheckStatus(nannyProfileId, checkField, status)` | ADMIN | Updates one of the 7 safety check fields |
| `getAdminStats()` | ADMIN | Returns dashboard counts |
| `getAdminNannies(filters?)` | ADMIN | Returns all nanny profiles with user + documents. `take: 100` limit |
| `getDocumentDownloadUrl(documentId)` | ADMIN | Generates 5-minute signed Storage URL |
| `updatePlacement(nannyProfileId, data)` | ADMIN | Sets placement status (AVAILABLE/TRIAL_PENDING/PLACED/CONTRACT_ENDING) + trialDate, placementStart, placementEnd, placementNote, paidConfirmed |

### Messages (`src/server/actions/messages.ts`) (NEW — Fiverr-style in-app chat)
| Function | Auth | Description |
|---|---|---|
| `getConversation(enquiryId)` | PARENT/NANNY/ADMIN (party to enquiry) + member-gated | Returns seed message + all replies (oldest first, `take: 200`). Non-admin: marks conversation as read via `ConversationRead` upsert |
| `sendMessage(enquiryId, body)` | PARENT/NANNY (not admin) + member-gated | Validates body (max 2000 chars), 2s anti-spam throttle, flags contact info via `detectContactInfo()`, creates `Message`, bumps enquiry `updatedAt`. Notifies other party: email every message + SMS throttled to 10min digest |
| `getMyConversations()` | Logged in (role-branched) | Inbox list: last message, unread count (messages newer than `ConversationRead.lastReadAt`), flagged count. `take: 50` |
| `getUnreadTotal()` | Logged in (not admin) | Total unread messages for nav badge. Cheap zeros on failure |

### Password Reset (`src/server/actions/password.ts`) (NEW)
| Function | Auth | Description |
|---|---|---|
| `requestPasswordReset(email)` | Public | Always returns success (no email enumeration). Nannies + families only (admins reset via DB). Stores SHA-256 hash of random 32-byte token, 1-hour expiry. 60s throttle on resends. Emails reset link |
| `resetPassword(token, password)` | Public | Validates token (SHA-256 hash lookup + expiry check). Min 6-char password. Sets new bcrypt hash, clears token (single use) |

### Reviews (`src/server/actions/reviews.ts`) (NEW — `Review` model now active)
| Function | Auth | Description |
|---|---|---|
| `createReview(nannyProfileId, rating, comment)` | PARENT | Rates a nanny (1–5). Gated on having an enquiry in MATCHED or CLOSED status. Upsert via `@@unique([parentId, nannyId])` — re-submitting updates existing review. Max 1000-char comment |

### Booking (`src/server/actions/booking.ts`) (NEW — Phase 2 paid bookings)
| Function | Auth | Description |
|---|---|---|
| `createBooking(input)` | PARENT + member-gated | Creates booking (PENDING_PAYMENT), validates date (today+), hours (1–12), starts provider checkout. Returns `{ url }` to redirect to. Booking only becomes REQUESTED (visible to nanny) after the verified webhook confirms payment — user can't self-advance by hitting the success URL |
| `acceptBooking(bookingId)` | NANNY | Transitions REQUESTED → ACCEPTED (via `canTransition`) |
| `declineBooking(bookingId)` | NANNY | Transitions REQUESTED → DECLINED; refunds parent (Stripe refund / PayPal capture refund) |
| `cancelBooking(bookingId)` | PARENT/NANNY | Transitions to CANCELLED; refunds parent if already paid |
| `completeBooking(bookingId)` | NANNY | Transitions IN_PROGRESS → COMPLETED_BY_NANNY |
| `approveBooking(bookingId)` | PARENT | Transitions COMPLETED_BY_NANNY → COMPLETED. Sets `payoutReleaseAt = now + PAYOUT_HOLD_HOURS` (48h) so the cron can release nanny earnings |
| `getMyBookings()` | PARENT | Parent's bookings, newest first |
| `getNannyBookings()` | NANNY | Nanny's bookings, newest first |

### Membership (`src/server/actions/membership.ts`) (NEW — parent subscriptions)
| Function | Auth | Description |
|---|---|---|
| `startMembershipCheckout(planId, provider)` | PARENT (not demo/backup) | Begins checkout. Returns `{ url }`. Stale-session check (user still exists in DB). Membership NOT activated here — only the verified webhook does that |
| `cancelMembership()` | PARENT | Cancels at period end (keeps access until `currentPeriodEnd`). Calls provider cancel |
| `getPaymentOptions()` | Any | Returns `configuredProviders()` — which providers have keys (plans page only offers these) |
| `getMyMembership()` | PARENT | Returns membership state for the dashboard panel |

### Tier (`src/server/actions/tier.ts`) (NEW — nanny one-time pricing tier)
| Function | Auth | Description |
|---|---|---|
| `startTierCheckout(tierId, provider)` | NANNY (not demo/backup) | Begins tier purchase ($50 Listed / $200 Premium). Returns `{ url }`. Nanny must have a profile first |
| `getMyTier()` | NANNY | Returns nanny's current tier + paid status |

### Payouts (`src/server/actions/payouts.ts`) (NEW — cron-driven nanny payout release)
| Function | Auth | Description |
|---|---|---|
| `releaseDuePayouts(limit=50)` | CRON_SECRET (via `/api/cron/payouts`) | Releases due booking payouts. A booking is due when COMPLETED, HELD, past `payoutReleaseAt`, and nanny has `payoutPaypalEmail`. Idempotent: claims row (HELD→RELEASED) before send, PayPal `senderItemId = booking_${id}` is the idempotency key. No PayPal email → skipped (admin/nanny prompted). On failure, rolls claim back to HELD for next run |

### Money (`src/server/actions/money.ts`) (NEW — admin money dashboard)
| Function | Auth | Description |
|---|---|---|
| `getMoneyOverview()` | ADMIN | Platform revenue (membership + tier + booking **fee**, not gross), gross processed, paid out to nannies, held for nannies, counts (active members, premium/listed nannies, bookings, payments), recent 12 payments |

---

## 10. Constants Reference (`src/lib/constants/index.ts`)

### Care Types (9)
| Value | Label |
|---|---|
| `casual_babysitting` | Casual Babysitting |
| `recurring_nanny` | Recurring Nanny Care |
| `after_school` | After-School Care |
| `weekend` | Weekend Care |
| `emergency_backup` | Emergency Backup Care |
| `specialist_sensory` | Specialist Sensory-Aware Care |
| `maternity_newborn` | Maternity & Newborn Care (月嫂) |
| `night_nanny` | Night Nanny / Overnight Care |
| `inclusive_neurodiverse` | Inclusive & Neurodiverse Care |

### Specialist Tags (10)
sensory_aware, neurodiverse, autism_support, adhd_support, ece_background, registered_teacher, early_intervention, first_aid, baby_experience, after_school_care

### Auckland Suburbs (20)
Remuera, Mount Eden, Ponsonby, Grey Lynn, Devonport, Takapuna, Newmarket, Epsom, Albany, Henderson, Parnell, Herne Bay, Mission Bay, St Heliers, Meadowbank, Kohimarama, Ellerslie, Mt Albert, Titirangi, Birkenhead

### 7 Safety Vetting Checks
| # | Key | Title | Document Type | Nanny Uploadable |
|---|---|---|---|---|
| 1 | `identityVerified` | Verify Identity | ID | Yes |
| 2 | `workHistoryVerified` | Work History | WORK_HISTORY | Yes |
| 3 | `proRegVerified` | Professional Registration | PROFESSIONAL_REGISTRATION | Yes |
| 4 | `refereeCheckStatus` | Referee Checks | REFEREE_LETTER | Yes |
| 5 | `policeVetStatus` | Police Vet | POLICE_VET | Yes |
| 6 | `interviewStatus` | Interview | — | No (admin) |
| 7 | `riskAssessmentStatus` | Risk Assessment | — | No (admin) |

### Document Types (8)
ID, REFERENCES, FIRST_AID_CERT, POLICE_VET, TEACHER_REGISTRATION, WORK_HISTORY, PROFESSIONAL_REGISTRATION, REFEREE_LETTER

### Status Enums
- **Safety check statuses:** NOT_STARTED, SUBMITTED, VERIFIED, REJECTED, NOT_APPLICABLE (only for `proRegVerified`)
- **Document review statuses:** PENDING, APPROVED, REJECTED
- **Nanny admin statuses:** DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, VERIFIED, SPECIALIST, SUSPENDED, ARCHIVED
- **Verification levels:** LISTED, VERIFIED, PREMIUM_VETTED, SPECIALIST
- **Placement statuses:** AVAILABLE, TRIAL_PENDING, PLACED, CONTRACT_ENDING (admin-managed, orthogonal to verification)
- **Job post statuses:** PENDING, APPROVED, CLOSED, REJECTED
- **Enquiry statuses:** NEW, CONTACTED, MATCHED, CLOSED
- **Membership plans** (`src/lib/membership.ts`): MONTHLY ($39), QUARTERLY ($89, "Most Popular"), ANNUAL ($149, "Best Value") — NZD, provider-agnostic
- **Membership statuses:** INACTIVE, ACTIVE, PAST_DUE, CANCELED, EXPIRED
- **Nanny tiers** (`src/lib/tiers.ts`): NONE, LISTED ($50 one-time), PREMIUM ($200 one-time, incl. First Aid training, "Best for bookings"). `tierRank()`: PREMIUM=2, LISTED=1, NONE=0 — used for search priority sort
- **Booking statuses** (`src/lib/booking.ts`): PENDING_PAYMENT, REQUESTED, ACCEPTED, UPCOMING, IN_PROGRESS, COMPLETED_BY_NANNY, AWAITING_PARENT_APPROVAL, COMPLETED, REVIEW_REQUESTED, DECLINED, CANCELLED. `BOOKING_TRANSITIONS` + `canTransition(from, to, role)` enforce valid moves
- **Booking payout statuses:** HELD, RELEASED, REFUNDED
- **Payment kinds:** MEMBERSHIP, BOOKING, DEPOSIT, PLACEMENT (DEPOSIT/PLACEMENT for future phases)
- **Payment statuses:** PENDING, PAID, FAILED, REFUNDED
- **Payment providers:** STRIPE, PAYPAL (both implement `PaymentProvider` interface)
- **Service fee:** `SERVICE_FEE_PCT = 0.1` (10%, single source in `booking.ts`). Fee-from-earnings model: parent pays subtotal, 10% comes out of nanny earnings
- **Payout hold:** `PAYOUT_HOLD_HOURS = 48` — funds held after parent approval before cron releases to nanny, so a late dispute can block it

---

## 11. Design System

Defined in `src/app/globals.css` using Tailwind CSS v4 `@theme inline` tokens.

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--background` | `#FDFBF7` | Soft warm cream |
| `--foreground` | `#0C1E36` | Midnight navy text |
| `--primary` | `#0F2E52` | Deep care navy (branding, active states) |
| `--primary-light` | `#204E7D` | Lighter primary |
| `--primary-dark` | `#071930` | Darker primary |
| `--secondary` | `#F4EFE6` | Sand-beige panels |
| `--accent` | `#B88A58` | Warm bronze/caramel |
| `--muted` | `#F7F4EC` | Muted backgrounds |
| `--muted-foreground` | `#5B6D80` | Muted body text |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--border` | `#E8E2D5` | Warm borders |
| `--destructive` | `#D9463E` | Errors |
| `--badge-verified` | `#0D9488` | Teal — verified status |
| `--badge-specialist` | `#0284C7` | Sky blue — specialist status |
| `--badge-premium` | `#D97706` | Amber — premium status |
| `--badge-listed` | `#6B7C82` | Slate — listed status |

### Typography
- **Headings:** `'Outfit', Georgia, serif` (via Google Fonts in root layout)
- **Body:** `'Plus Jakarta Sans', system-ui, sans-serif`
- Custom size scale: `--text-xs: 13px` through `--text-6xl: 64px` (larger than Tailwind defaults)

### Visual Style
- Large child-friendly rounded corners (`--radius-xl: 32px`)
- Organic blob animations (`morph-blob-1/2/3` keyframes)
- Glassmorphism headers
- Soft, low-opacity, warm-toned shadows
- `fadeIn`, `slideUp`, `slideInRight` entrance animations
- `.stagger-children` utility for staggered entrance (60ms increments)
- `.skeleton` shimmer loading
- Mobile bottom nav with safe area padding
- Reduced motion support

### CSS Specificity Note
The global rule `h1, h2, h3, h4 { color: var(--foreground) }` in `globals.css` overrides Tailwind utility classes like `text-white`. When white text is needed on a dark background (e.g. blue gradient banners), use **inline styles** (`style={{ color: '#FFFFFF' }}`) rather than Tailwind classes.

---

## 12. Accounts

### Backup Admin Account (env-backed, no DB required)
Credentials are **not documented here by design** — they live only in `ADMIN_BACKUP_EMAIL` /
`ADMIN_BACKUP_PASSWORD` (Vercel production env + local `.env`).

Emergency admin access — works without a database. Enabled only when `ADMIN_BACKUP_EMAIL` and `ADMIN_BACKUP_PASSWORD` env vars are both set (fail closed, no hardcoded default). This is the only auth bypass; the old `demo1234` universal password was removed.

### DB-Seeded Demo Accounts (removed)
The seed script (`prisma/seed.ts`) is now a **no-op** — all demo/sample data was removed. The platform is live with real accounts. Real nannies and parents sign up through the app. Admin access is via the env-backed backup admin only.

> **Note:** `npm run db:seed` still runs without error but does nothing. Do NOT recreate demo users in the seed script — real accounts exist in the DB.

---

## 13. Deployment

- **Platform:** Vercel (connected to GitHub repo `Zreeshah/nanny-ora`)
- **Auto-deploy:** On push to `main` branch
- **Production URL:** https://nanny-ora.vercel.app
- **Build command:** `next build` (with `postinstall: prisma generate`)
- **Node version:** 24.x
- **Vercel Cron** (`vercel.json`): `/api/cron/payouts` daily at `0 3 * * *` (03:00 UTC). Route is `CRON_SECRET`-gated — Vercel sends `Authorization: Bearer <CRON_SECRET>`, rejected otherwise so it can't be poked from outside to move money

### SEO (Next.js Metadata Route Handlers)
- **`src/app/robots.ts`** — `robots.txt`. Allows `/`, disallows `/dashboard/`, `/admin/`, `/api/`, `/login`, `/forgot-password`, `/reset-password`. Sitemap + host declared.
- **`src/app/sitemap.ts`** — `sitemap.xml`. Static marketing + landing pages (priority-weighted) + suburb SEO pages (`SUBURB_SLUGS`) + approved nanny profiles (slug-based URLs, `take: 200`).
- **`src/app/opengraph-image.tsx`** — dynamic OG image via `ImageResponse` (NannyOra brand card).
- **`src/lib/seo.ts`** — schema.org builders: `organizationSchema`, `websiteSchema`, `localBusinessSchema` (ChildCare type for local-pack relevance), `breadcrumbSchema`, `personSchema` (nanny profiles + `aggregateRating`), `faqSchema`. Injected via `src/components/seo/JsonLd.tsx`.

### Database Management
```bash
# Apply schema changes to Supabase
npm run db:push

# Seed (no-op — demo data removed; real accounts live in DB)
npm run db:seed

# Generate Prisma client (auto-runs on npm install)
npx prisma generate
```

### Local Development
```bash
npm install      # installs deps + runs prisma generate
npm run dev      # starts at http://localhost:3000
```

---

## 14. Key Architectural Decisions

1. **No Supabase Auth** — NextAuth handles all authentication; Supabase is used only for Postgres + Storage
2. **JSON-as-string storage** — Arrays stored as `JSON.stringify()` in `String` columns (not native Postgres arrays) for cross-platform serialization simplicity
3. **Server-side file uploads** — All Supabase Storage access is server-side using the service_role key (never exposed to browser); the browser Supabase client was deleted as dead code
4. **Private storage bucket** — Vetting documents are private; admin downloads use 5-minute signed URLs generated server-side
5. **7-step safety vetting** — Structured workflow mapping document types to check status fields; steps 6-7 are admin-only
6. **Police vetting authorization** — Required consent checkbox (Children's Act 2014) on the nanny application; stored with timestamp for compliance
7. **Backup admin access** — Env-backed emergency admin account (`ADMIN_BACKUP_EMAIL` / `ADMIN_BACKUP_PASSWORD`) works without a DB. The old `demo1234` universal password bypass was removed. All other accounts require bcrypt-verified DB lookups.
8. **Route protection** — `src/proxy.ts` middleware guards `/admin/*` and `/dashboard/*` by role using JWT token inspection
9. **Lifecycle email system** — 10 transactional email templates via Resend, triggered after DB writes (welcome, verification updates, enquiry/job status, admin notifications). No-ops without `RESEND_API_KEY`. Branded `emailShell()` wrapper, three sender identities
10. **Profile view tracking** — Anonymous `ProfileView` records created on nanny profile visits via invisible `ViewTracker` client component. Demo + backup admin IDs stored as null to avoid FK errors
11. **Favourites system** — Parents save nannies via `Favourite` model with unique `[parentId, nannyId]` constraint. `FavouriteButton` uses optimistic UI with revert. Hidden for non-PARENT roles
12. **Dashboard data aggregation** — `getNannyDashboard()` and `getParentDashboard()` in `engagement.ts` aggregate live DB data (views, enquiries, jobs, checks, favourites, recommendations) into single server-action calls consumed by client dashboards
13. **JWT expiry** — Session `maxAge: 7 days` (was 30-day NextAuth default). `AUTH_SECRET` required — throws on startup if unset, no hardcoded fallback
14. **Bounded queries** — All `findMany` calls have `take` limits (50-100) to prevent LPDOS from unbounded result sets
15. **File upload validation** — `applyAsNanny` and `uploadNannyDocument` validate file size (5MB max) + type (PDF/JPG/PNG/WebP) before uploading to Storage
16. **View rate limiting** — `recordProfileView` has a 30s in-memory throttle per `nannyId` + nannyId existence check to prevent view count inflation
17. **In-app messaging** — Fiverr-style two-way chat within enquiry threads. `Message` model + `ConversationRead` read markers. Contact info auto-flagged by `detectContactInfo()`. Email + SMS (throttled) notifications
18. **Password reset flow** — SHA-256 token hash (raw token never stored), 1-hour TTL, single use. No email enumeration (always returns success). Nannies + families only (admins reset via DB)
19. **SMS notifications** — Twilio via plain REST (no SDK), best-effort (no-ops without env vars). NZ phone normaliser (`toE164NZ`). SMS throttled to 10-min digest per conversation
20. **Content moderation** — `detectContactInfo()` flags email/phone in messages. Handles common obfuscations ("at"/"dot", spelled digits). Admin flag review is the human backstop
21. **Reviews** — `Review` model now active. Parents rate nannies (1–5) after MATCHED/CLOSED enquiry. Upsert via unique `[parentId, nannyId]` — re-submitting updates
22. **Job applications** — Nannies one-click apply to APPROVED jobs via `JobApplication` model. Idempotent per (job, nanny). Admin sees applicants in job list
23. **Backup admin fail-closed** — Emergency admin account exists only when BOTH `ADMIN_BACKUP_EMAIL` + `ADMIN_BACKUP_PASSWORD` env vars are set. No hardcoded credentials in code
24. **No sample/demo data** — `seed.ts` is a no-op; `sample-nannies.ts` deleted. The directory returns `[]` on DB error instead of mock data. The site looks empty (not fake) when the DB is down.
25. **Placement/availability status** — Admin-managed `placementStatus` (AVAILABLE/TRIAL_PENDING/PLACED/CONTRACT_ENDING) orthogonal to verification. `PlacementBadge` on `NannyCard` shows when not AVAILABLE. `paidConfirmed` is internal-only, never exposed in `NannyProfilePublic`.
26. **FAQ content** — `parentFaqs` (4) + `nannyFaqs` (5) in `src/lib/faq.ts`, rendered via `FaqGroups` on homepage + how-it-works. Covers NZ-specific payroll, employment, holidays, privacy.
27. **Suburb autocomplete** — `src/lib/suburbs.ts` holds ~160 Auckland suburbs grouped by 5 regions. `SuburbAutocomplete` component (chip input + dropdown suggestions). Region-aware matching: searching "East Auckland" finds Botany; nanny listing "East Auckland" matches searched "Botany".
28. **Provider-agnostic payments** — `PaymentProvider` interface (in `src/lib/payments/types.ts`) with one implementation per provider. Adding a provider or flow = add a method + implement per provider, no call-site changes. `getProvider(id)` + `configuredProviders()` let the UI offer only providers with keys present.
29. **Membership gate (soft-launch)** — `MEMBERSHIP_ENFORCED` env var, OFF by default. Checkout + dashboard fully work in production WITHOUT locking existing free parents out of messaging/shortlisting. Flip to `true` (no redeploy) to enforce. `requireMembership()` is the single choke point every member-only server action calls first — a new locked feature can't accidentally ship ungated.
30. **Webhook-only activation** — Membership is NOT activated on the checkout success URL (user can't self-grant). Only the verified Stripe/PayPal webhook calls `activateMembership()`. Same for booking → REQUESTED and tier settlement.
31. **Nanny pricing tiers** — One-time upfront payment (not monthly): LISTED $50, PREMIUM $200 (incl. First Aid training). `tierRank()` sorts search: Premium floats above Listed above unpaid. Stored on `NannyProfile.tier`.
32. **Booking fee-from-earnings** — Parent pays the subtotal (no surcharge); the 10% platform fee comes OUT of the nanny's earnings. `quoteBooking(rate, hours)` is the single pure source (client + server share it). Nanny nets `subtotal − fee`.
33. **Booking fund holding + auto-payout** — Funds land in the platform account and are HELD until the booking completes. After parent approval (`COMPLETED`), a 48h hold (`PAYOUT_HOLD_HOURS`) lets a late dispute block payout. Then the daily cron (`/api/cron/payouts`) releases to the nanny's PayPal email. Idempotent: claim-then-send with `booking_${id}` as the PayPal `senderItemId`.
34. **Name-based nanny profile URLs** — `slugify(name)` → "jessie-wu" stored on `NannyProfile.slug` (unique). `uniqueNannySlug(name)` appends `-2`, `-3` on collision. `getPublicNannyById` looks up by `slug OR id` so old cuid links still resolve.
35. **Technical SEO** — `robots.ts` + `sitemap.ts` (static + suburb SEO + approved profiles) + `opengraph-image.tsx` + schema.org JSON-LD (`src/lib/seo.ts` builders injected via `JsonLd.tsx`). `ChildCare` LocalBusiness schema for local-pack relevance. `Person` schema on nanny profiles with `aggregateRating`.
36. **TrustStrip two-row layout** — Homepage trust strip split into baseline checks (every carer: Verified IDs, Police Vetted, Face-to-Face Interviewed, First Aid Ready) + advanced expertise (optional: ECE Qualified, Neurodiversity & Inclusive Practice, Baby Sleep Support, Maternity & Postnatal Care), separated by a divider.

---

## 15. Known Limitations & Future Work

- **Preview deployments** on Vercel may fail — Preview environment is missing `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `AUTH_TRUST_HOST` (only Production has them)
- **`deleteNannyDocument`** removes the DB record but does NOT delete the file from Supabase Storage (orphaned files accumulate)
- **`uploadProfilePhoto`** with extension change leaves the old file orphaned in Storage
- **Post-commit email bug** — `applyAsNanny`, `registerParent`, `createEnquiry`, `createJobPost`, and admin status updates all `await` emails after the DB write. If email throws, client sees failure but the DB mutation already committed. Should use per-send try/catch or `Promise.allSettled`
- **`createEnquiry` / `createJobPost`** accept any logged-in role (should be PARENT-only); `contactEmail` comes from input, not session (spoofable)
- **View throttle + message throttle + SMS throttle are in-memory** — won't survive restarts or work across serverless instances. Upgrade to Redis/Upstash if rate-limiting needs to be strict
- **`SkillTag` model** exists in schema but is unused (specialist tags are hardcoded in constants, not DB-driven)
- **Membership enforcement is OFF by default** (`MEMBERSHIP_ENFORCED` unset) — checkout + dashboard work, but messaging/enquiries/shortlisting are NOT yet gated. Flip the env var (no redeploy) to enforce. The gate code (`requireMembership`) is wired into all member-only actions; it just returns `null` until the switch is on.
- **PayPal Payouts require the nanny's PayPal email** — bookings with no `payoutPaypalEmail` stay HELD until the nanny adds one. The cron skips them (logged), admin/nanny is prompted.
- **Booking UI is a subset of the full workflow** — `BOOKING_TRANSITIONS` models the complete flow (PENDING_PAYMENT → … → REVIEW_REQUESTED) but the active UI wires create → pay → accept/decline → complete → approve. The later stages (UPCOMING, IN_PROGRESS, REVIEW_REQUESTED) are valid status values ready to activate without a schema or type change.
- **Payout cron is daily (Vercel Hobby plan limit)** — `/api/cron/payouts` runs once at 03:00 UTC. The 48h hold makes daily sweeps fine, but payouts can lag up to ~24h past `payoutReleaseAt`. Upgrade to Pro for more frequent runs if needed.
- **`lucide-react` v1.18.0** — unusual version pin (latest is v0.x); may have API differences
- **Lint has ~619 errors** — mostly `@typescript-eslint/no-explicit-any` on `(session.user as any).role` patterns; not blocking builds
- **SEO landing pages** (`/ece-nanny-auckland`, etc.) are statically rendered and don't pull from the database
- **Stale comments in `nannies.ts`** — `getPublicNannies`/`getPublicNannyById` JSDoc still mentions "falls back to sample data" but sample data was deleted; they now return `[]` / `undefined` on DB error
- **Logo tagline** — the tagline "Curated Care. Warm Hearts." is now rendered as CSS text below the `logo-wordmark.png` wordmark in Header, Footer, login page, and admin header. The old `logo.png` (with baked-in raster tagline) is retired but still in `public/`.

---

## 16. Recent Changes (Post-Context-File)

The following changes were made after the initial `project_context.md` was written (commit `861bf03`):

### UI & Animation Overhaul
- **Local image library** (`src/lib/images.ts`) — 34 contextual Auckland childcare photos in `public/images/`, with `pickImages()` deterministic seeded picker (cyrb53 hash + mulberry32 PRNG) for stable SSR/CSR image selection
- **Animated UI components** (`src/components/ui/`) — `Reveal` (scroll-triggered fade/slide via IntersectionObserver), `ShinyText` (gradient-sheen text), `BorderBeam` (traveling border light), `ImageBand` (drop-in contextual image section). All pure CSS, no framer-motion.
- **Homepage redesign** — `InteractiveHero` now uses layered photo collage + floating trust badges; new sections: `TrustStrip`, `TrustStandard` (7-layer safety timeline), `SpecialistExpertise` (8 specialist care cards), `LifestyleGallery` (masonry Pinterest-style), `DayInLife` (emotional storytelling). `MarqueeTestimonials` replaced infinite marquee with static 3-column grid + emotional headlines.
- **Scroll animations** — `Reveal` + `ImageBand` added across all public pages (find-a-nanny, how-it-works, pricing, trust-and-safety, all SEO landing pages, apply-as-nanny, post-a-job, register-family)

### Email System (`src/lib/email/`)
- **Resend integration** — `sendEmail()` best-effort sender (no-ops without `RESEND_API_KEY` so dev/demo never breaks)
- **`sendRefereeRequests()`** — auto-emails each referee a reference request when a nanny applies (wired into `applyAsNanny` server action)
- **`escapeHtml()`** — XSS guard for user-supplied strings in email HTML
- Added `resend` dependency to `package.json`

### New Logo (`logo-wordmark.png`)
- Clean wordmark logo without baked-in tagline — replaces old `logo.png` everywhere (Header, Footer, login page, admin header)
- Tagline "Curated Care. Warm Hearts." rendered as crisp CSS text below the wordmark
- Old `logo.png` retained in `public/` but no longer referenced

### CSS Fixes
- Base heading color rule moved into `@layer base` (fixes specificity war with Tailwind utility classes)
- Added `border-beam` and `text-shimmer` keyframes for animation components
- Added `grow-x` keyframe for admin dashboard bar animations
- Added `prefers-reduced-motion` rules to freeze animations

### Filter Sidebar + Language Immersion (find-a-nanny redesign)
- **Sidebar layout** — moved filters from collapsible panel to sticky left sidebar (desktop) / slide-out drawer (mobile) on `/find-a-nanny`
- **Multi-select filters** — care types, specialist tags, language tags, and age ranges changed from single-select dropdowns to checkbox pills (multi-select)
- **Auckland regions** — `AUCKLAND_REGIONS` in constants; `SUBURB_TO_REGION` mapping was in constants but later moved to `src/lib/suburbs.ts` (`SUBURB_REGIONS`). Filter by Central / East / North Shore / West / South
- **Language immersion** — new `LANGUAGE_TAGS` constant (Mandarin, Cantonese, Korean, Japanese, Spanish, Te Reo Māori); new `languages: string[]` field on `NannyProfilePublic`; language immersion badges rendered on `NannyCard`
- **Child age filter** — maps age ranges to existing specialist tags via heuristic (`AGE_TO_TAG` — newborn/infant/toddler→`baby_experience`, preschool→`ece_background`, school_age/teenager→`after_school_care`)
- **Childcare support note** — replaced government funding note with softer "Childcare Support Options" info box linking to `/childcare-support`
- **Sample data** — added `languages` to all 10 sample nannies (Lily Chen→Mandarin, Grace Taylor→Korean, Hannah Patel→Te Reo Māori, Rachel Foster→Spanish, others→empty)

### DB-Backed Nanny Directory (`src/lib/data/nannies.ts`)
- **New data layer** — `getPublicNannies()` queries Prisma for APPROVED/VERIFIED/SPECIALIST nannies. Originally fell back to sample data when DB was empty; sample data later removed (returns `[]` on error)
- **`getPublicNannyById()`** — single nanny lookup, DB first then sample data fallback
- **`toPublic()`** — maps Prisma `NannyProfile` row → `NannyProfilePublic` type (parses JSON string arrays)
- **`languages`** now read from DB via `parseJsonArray(row.languages)` — the `ponytail:` shortcut is resolved (column added to schema)
- **`find-a-nanny/page.tsx`** refactored from single client component to server/client split: `page.tsx` (SERVER, 16 lines, metadata + `revalidate = 300`) fetches data, passes to `FindANannyClient.tsx` (CLIENT, 448 lines) for filter UI
- **`sample-nannies.ts`** refactored — `NannyFilters` type extracted and exported, `filterNannies()` extracted as reusable function (works on any nanny list, not just samples)

### New Public Pages
- **`/verification-process`** (232 lines, SERVER) — detailed 7-layer verification process page with trust metrics, process-at-a-glance diagram, detailed "what / why it matters / how you're protected" cards for each check, "your role matters too" section, and CTA
- **`/childcare-support`** (81 lines, SERVER) — soft informational page about childcare support options (not a subsidy CTA). Concierge-style guidance: "we quietly assess eligibility for you"
- **Homepage "How it works"** simplified from 8 steps → 4 calm steps ("Share your needs → Get matched → Meet & confirm → Begin care")
- **Homepage hero copy** changed from "Nanny Care Perfected" → "Private Nanny Placement"; subtext rewritten to emphasize premium/agency-verified/matched privately
- **`TrustStandard` component** now links to `/verification-process` page
- **Footer** added "Childcare Support Options" link; "Our Verification Process" link now points to `/verification-process`

### Admin Dashboard Redesign
- **`admin/page.tsx`** (346 lines) — warm "operations center" dashboard: live KPI cards with `StatsTicker` + inline SVG sparklines + completion rings; 7-step verification funnel with animated bars and drop-off counts; recent applications grid with progress bars; live activity feed; review queue cards. Uses `getAdminStats()` for live data; funnel/recent/activity use representative data.
- **`admin/layout.tsx`** — dark header using `logo-wordmark.png`, "Admin" label badge
- **`admin/nannies/page.tsx`** (519 lines) — warm card design with image fallbacks via `pickImages()` when no profile image
- **`admin/jobs/page.tsx`** — warm card design with Briefcase icons, colored status badges
- **`admin/enquiries/page.tsx`** — parent→nanny flow visualization with avatar initials and arrow

### Police Vetting Authorization
- Required checkbox on Step 4 of nanny application with full Children's Act 2014 authorization text
- Two new DB fields on `NannyProfile`: `policeVetAuthorized` (Boolean), `policeVetAuthorizedAt` (DateTime?)
- Form submission blocked until authorization is given

### Care Types Expansion
- Added 3 new care types: `maternity_newborn` (Maternity & Newborn Care / 月嫂), `night_nanny` (Night Nanny / Overnight Care), `inclusive_neurodiverse` (Inclusive & Neurodiverse Care)

### Suburb Free-Text Inputs + TagInput Component
- **All suburb dropdowns replaced** — `AUCKLAND_SUBURBS` select dropdowns replaced with free-text `<Input>` (single-suburb fields) and `<TagInput>` (multi-suburb fields) across all 5 forms (apply-as-nanny, ProfileForm, register-family, post-a-job, find-a-nanny filter sidebar)
- **New `TagInput` component** (`src/components/ui/TagInput.tsx`, 104 lines) — type + Enter to add chip, Backspace to remove last, dedup, onBlur commits
- **`AUCKLAND_SUBURBS`** removed from imports in all 5 form files; stays in `constants/index.ts` for SEO pages. `SUBURB_TO_REGION` was later replaced by `SUBURB_REGIONS` in `src/lib/suburbs.ts`

### Police Vet Admin-Only
- **`policeVetStatus`** changed from `nannyUploadable: true` → `false` — NannyOra obtains its own police vet; vets from other services cannot be shared
- Upload UI automatically hidden in apply-as-nanny (Step 3) and ProfileForm

### Engagement System + Lifecycle Email + Dashboard Rewrites (commit `d7cc2aa`)
- **New DB models:** `Favourite` (parent saves nanny, unique pair) + `ProfileView` (anonymous view tracking with nullable viewerId). Schema now has 9 models
- **New `NannyProfile.languages`** column (JSON string, default `"[]"`)
- **New server action file `engagement.ts`** (272 lines) — `toggleFavourite`, `getFavouriteIds`, `recordProfileView`, `getNannyDashboard`, `getParentDashboard`, `getMyNannyEnquiries`
- **Lifecycle email system** — 10 new transactional templates in `src/lib/email/index.ts`: nanny/parent welcome, verification update, enquiry receipt + status, job status, 4 admin notifications. Branded `emailShell()` wrapper, 3 sender identities (`info@`, `verification@`, `admin@nannyora.co.nz`), admin CC'd to 2 addresses. Wired into all create/update server actions
- **Profile photo upload** — `uploadProfilePhoto(file)` in `nanny.ts`, uploads to public `nanny-photos` Supabase bucket. Validates type (JPG/PNG/WebP) + 5MB. `next.config.ts` whitelists `**.supabase.co` for `next/image`
- **New public-facing components:**
  - `nannies/[id]/EnquiryForm.tsx` (107 lines) — parent sends message from nanny profile; guests see register CTA with post-registration redirect handshake
  - `nannies/[id]/ViewTracker.tsx` (12 lines) — invisible component fires `recordProfileView` on mount
  - `cards/FavouriteButton.tsx` (45 lines) — optimistic heart toggle, hidden for non-PARENT roles
- **Dashboard rewrites:**
  - `dashboard/nanny/page.tsx` (267 lines) — live stats from `getNannyDashboard()`: profile views, matching jobs, 7-check vetting progress, recent enquiries, `"…"` loading placeholders
  - `dashboard/parent/page.tsx` (363 lines) — live stats from `getParentDashboard()`: saved nannies, recommended nannies, active enquiries, job posts, family profile summary
  - `dashboard/nanny/enquiries/page.tsx` (84 lines, NEW) — nanny's dedicated enquiries inbox
  - `dashboard/parent/profile/page.tsx` (142 lines, NEW) — parent profile editor (suburb, age ranges, care types, specialist needs, notes)
- **Dead-code cleanup:**
  - Deleted: `src/components/ui/EmptyState.tsx`, `src/components/ui/LoadingSpinner.tsx`, `src/lib/supabase/browser.ts` (all zero references)
  - Removed constants: `USER_ROLES`, `JOB_POST_STATUSES`, `ENQUIRY_STATUSES`, `AUCKLAND_SUBURBS`, `DOCUMENT_REVIEW_STATUSES`, `EXPERIENCE_LEVELS`, `RATE_RANGE`
  - Removed types from `src/types/index.ts`: 9 interfaces deleted (now sourced from `@prisma/client`); only `NannyProfilePublic` remains
  - Removed validations: `loginSchema`, `registerSchema` (login handled inline; registration split into parent/nanny schemas)
  - Removed deps: `@auth/prisma-adapter` (unused — JWT auth), `@types/bcryptjs` (bcryptjs v3 self-types)
  - New dep: `server-only ^0.0.1` (guarantees email code never ships to browser)
  - New script: `npm test` — runs `tsx src/lib/email/escape.test.ts src/lib/images.test.ts`
  - `src/types/index.ts` now re-exports types from `@prisma/client` instead of defining its own interfaces

### Security Audit + Fixes (commit `073ba85`)
Comprehensive read-only audit across 7 vulnerability classes, followed by fixes:

**Audit results (clean — no changes needed):**
- **SSTI** — No `dangerouslySetInnerHTML`, `eval()`, or `new Function()` anywhere. Email templates use `escapeHtml()` on all user input.
- **ReDoS** — All regexes are linear (char classes, simple anchors). No catastrophic backtracking.
- **SQL Injection** — All DB access via Prisma parameterized queries. Zero `$queryRaw` / `$executeRaw` calls.
- **Clipboard Attack** — No clipboard API usage anywhere in the codebase.

**Fixes applied:**
- **Secret key leak (CRITICAL)** — Removed hardcoded `"nannyora-dev-secret-change-in-production"` JWT fallback from `auth.ts` + `proxy.ts`. `AUTH_SECRET` now required — throws on startup if unset.
- **Demo backdoor (CRITICAL)** — Removed `demo1234` universal password bypass (worked for any email). Replaced with env-backed backup admin account only (`ADMIN_BACKUP_EMAIL` / `ADMIN_BACKUP_PASSWORD`).
- **JWT expiry (Replay)** — Set `maxAge: 7 days` (was 30-day NextAuth default).
- **Unauthenticated PII endpoints (LPDOS/Replay)** — `getEnquiries` + `getJobPosts` now require ADMIN auth (were public, returned parent name + email).
- **Unbounded queries (LPDOS)** — Added `take: 50-100` to all `findMany` calls: `getEnquiries`, `getJobPosts`, `getAdminNannies`, `getMyNannyEnquiries`, `getPublicNannies`, `getFavouriteIds`, `getParentDashboard` favourites.
- **File upload validation (LPDOS)** — `applyAsNanny` + `uploadNannyDocument` now validate file size (5MB max) + type (PDF/JPG/PNG/WebP) before uploading.
- **View inflation (LPDOS)** — `recordProfileView` now has 30s in-memory throttle per `nannyId` + nannyId existence check.

**Backup admin credentials:**
- Set via env vars only: `ADMIN_BACKUP_EMAIL`, `ADMIN_BACKUP_PASSWORD` (Vercel prod + local `.env`)
- No default in code — if the vars are unset, the backup account does not exist (fail closed)
- Works without DB; all other accounts require bcrypt-verified DB lookups

### Fail-Closed Backup Admin (commit `a08f8eb`)
- Backup admin no longer has hardcoded credentials — if `ADMIN_BACKUP_EMAIL` or `ADMIN_BACKUP_PASSWORD` env vars are unset, the backup account doesn't exist at all (fail closed). No credential in code to leak.

### Password Reset (commit `626d39c`)
- **New pages:** `/forgot-password` (request form) + `/reset-password` (set new password with token)
- **New server action file `password.ts`** — `requestPasswordReset(email)` + `resetPassword(token, password)`
- **Security:** SHA-256 token hash (raw token never stored), 1-hour TTL, single use. Always returns success (no email enumeration). Nannies + families only — admins reset via DB. 60s resend throttle.
- **New User fields:** `resetTokenHash`, `resetTokenExpiry`
- **New email function:** `sendPasswordReset` in `src/lib/email/index.ts`
- Login page now has "Forgot password?" link

### In-App Messaging / Fiverr-Style Chat (commit `4163df1`)
- **New DB models:** `Message` (threaded replies within enquiry), `ConversationRead` (per-user read markers for unread counts)
- **Enquiry model updated:** `flagged` (Boolean — seed message contains contact info), `contactEmail`/`contactPhone` (admin-only), `messages[]`, `reads[]`, `updatedAt` (bumped on each message)
- **New server action file `messages.ts`** (210 lines) — `getConversation`, `sendMessage`, `getMyConversations`, `getUnreadTotal`
- **New components:** `ConversationList.tsx` (inbox), `ConversationThread.tsx` (chat view) in `src/components/messaging/`
- **New pages:** `/dashboard/parent/messages` + `[id]`, `/dashboard/nanny/enquiries/[id]`, `/admin/enquiries/[id]`
- Dashboard layout shows unread message badge in nav (`getUnreadTotal`)
- `sendMessage`: 2s anti-spam, 2000-char max, flags contact info, notifies other party (email + SMS throttled to 10min)

### SMS Notifications (commit `4163df1`)
- **New `src/lib/sms/index.ts`** — Twilio via plain REST (no SDK, Basic auth). Best-effort (no-ops without `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_FROM`)
- **New `src/lib/sms/normalise.ts`** — `toE164NZ()` normalises NZ-entered phones to E.164
- **New env vars:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`
- SMS throttled to 10-min digest per conversation (in-memory)

### Content Moderation (commit `4163df1`)
- **New `src/lib/moderation.ts`** — `detectContactInfo(text)` flags email/phone in messages
- De-obfuscates common patterns: "at"/"dot" → @/., spelled-out digits ("oh two one" → "021")
- Used by `createEnquiry` (seed message) + `sendMessage` (replies) — flagged messages visible to admin
- `Enquiry.flagged` + `Message.flagged` boolean fields

### Reviews (commit `5d0e882`)
- **`Review` model now active** (was Phase 2 placeholder) — `@@unique([parentId, nannyId])`, upsert updates
- **New server action file `reviews.ts`** — `createReview(nannyProfileId, rating, comment)`. PARENT-only, gated on MATCHED/CLOSED enquiry, 1–5 rating, max 1000-char comment
- **New `getNannyReviews(nannyId)`** in `nannies.ts` — public reviews with first-name-only privacy. `take: 20`
- Nanny dashboard shows review count + avg rating

### Job Applications (commit `5d0e882`)
- **New DB model `JobApplication`** — `@@unique([jobId, nannyProfileId])`, PENDING/ACCEPTED/DECLINED status
- **New `applyToJob(jobId)`** in `job.ts` — NANNY-only, one-click, idempotent, APPROVED jobs only, notifies admin
- `getJobPosts` now includes applications (with nanny names, `take: 20`)
- `getNannyDashboard` includes `appliedJobIds` so nanny dashboard can show "Applied" state on jobs

### Professional Registration N/A Toggle (commit `76f81e7`)
- **New `setProRegApplicability(notApplicable)`** in `nanny.ts` — toggles `proRegVerified` between NOT_STARTED and NOT_APPLICABLE
- Only works when current status is NOT_STARTED or NOT_APPLICABLE (never clobbers submitted/verified)
- `NOT_APPLICABLE` added as a safety check status value (only offered for Professional Registration)
- ProfileForm shows "Not applicable" toggle for pro reg check

### Brand Favicon + Hero/Banner Updates (commits `1134726`, `628534d`, `c22fa06`, `b9c5b45`)
- **Brand favicon** — `icon.png`, `apple-icon.png`, `favicon.ico` (tan heart mark on navy circle, generated from logo)
- **Hero collage** swapped to real NannyOra photos (`hero-nanny-reading.jpeg`, `hero-sensory-play.jpeg`)
- **Hero badge** "Sensory-Led Nanny" (was "ADHD-Aware")
- **How-it-works banner** — sensory foam play photo (`how-it-works-band.jpeg`), then mirror-play babies photo (`how-it-works-band.jpeg`, pre-cropped 16:9)
- **Find-a-nanny banner** — new `find-a-nanny-band.jpeg`

### Other UI Fixes
- **Mobile/tablet responsiveness** (commit `ddcf10d`) — header breakpoint fix + parent stat tile layout
- **Select chevron overlap** (commit `8950d0b`) — fixed dropdown arrow overlap

### Nanny Placement Status + Demo Data Removal (commit `4e1c8a9`)
- **New DB fields on `NannyProfile`:** `placementStatus` (AVAILABLE/TRIAL_PENDING/PLACED/CONTRACT_ENDING), `trialDate?`, `placementStart?`, `placementEnd?`, `placementNote?`, `paidConfirmed` (Boolean, admin-only internal flag)
- **New `PLACEMENT_STATUSES` + `PLACEMENT_STATUS_LABELS`** in `src/lib/constants/index.ts`
- **New `PlacementBadge` component** in `Badge.tsx` — shows "Available" / "Trial Pending" / "Placed" / "Available from {date}" on `NannyCard` (only when status ≠ AVAILABLE)
- **New `updatePlacement(nannyProfileId, data)`** in `admin.ts` — ADMIN-only, validates placement status value
- **`NannyProfilePublic` type** includes all placement fields except `paidConfirmed` (intentionally excluded — internal only)
- **Admin nannies page** shows placement management UI
- **Sample/demo data removed:**
  - `src/lib/data/sample-nannies.ts` DELETED (288 lines, 10 mock nannies)
  - `prisma/seed.ts` is now a no-op (241 → 14 lines)
  - `src/lib/data/nannies.ts` — no more sample fallback; returns `[]` on DB error
  - `NannyFilters` type + `filterNannies()` function moved from `sample-nannies.ts` to `nannies.ts`
  - Login page — demo quick-login buttons removed (46 lines)

### FAQ (commit `3aa65bf`)
- **New `src/lib/faq.ts`** — `parentFaqs` (4: payroll, job description, public holidays/sick leave, 90-day trial) + `nannyFaqs` (5: employee vs contractor, mileage reimbursement, privacy/social media, sick child procedure, cooking duties)
- **New `src/components/FaqGroups.tsx`** — grouped FAQ renderer (For Parents + For Nannies), reuses `Accordion`
- Added to homepage + how-it-works page

### Suburb Autocomplete + Region-Aware Search (commits `f89109a`, `344035b`, `9d643bb`, `50a2c7c`, `15d79e7`)
- **New `src/lib/suburbs.ts`** (137 lines) — master Auckland suburb list (~160 suburbs grouped by 5 regions), `normSuburb()` (normalise for matching), `titleCaseSuburb()`, `regionOf()`, `suburbMatches()` (region-aware: "East Auckland" finds Botany; "Botany" finds a nanny listing "East Auckland")
- **New `src/components/ui/SuburbAutocomplete.tsx`** (107 lines) — chip input + dropdown suggestions, free entry still allowed, Enter picks top suggestion or typed text
- **`SUBURB_TO_REGION` removed** from `constants/index.ts` — suburb→region membership now derived from `SUBURB_REGIONS` in `suburbs.ts`
- **Find-a-nanny Location filter** — changed to add-any-suburb chip input (`SuburbAutocomplete`); suggestions only suburbs where nannies actually exist
- **Nanny forms** — apply form + profile editor both use `SuburbAutocomplete` for "Suburbs You Cover"; suggestions include region umbrellas ("North Shore") then specific suburbs
- **Added Murrays Bay** to North Shore, ~65 more suburbs across all regions

### Find-a-Nanny Filter UX Fixes (commits `0ea4b61`, `1ffb5f2`)
- Fixed inputs losing focus per keystroke (state management issue)
- Fixed slider step values
- Fixed dual search roles (parent searching vs nanny searching)
- Fixed mobile filter sheet UX

### TrustStrip Two-Row Split + Verification Copy (commit `45a8545`)
- **`TrustStrip.tsx`** rewritten — split 7 single-row items into two rows with a divider:
  - Row 1 "Every NannyOra carer is" (baseline, 4): Verified IDs, Police Vetted, Face-to-Face Interviewed, First Aid Ready
  - Row 2 "Looking for advanced educational expertise?" (advanced, 4): ECE Qualified Carers, Neurodiversity & Inclusive Practice, Baby Sleep Support, Maternity & Postnatal Care
  - Dropped from baseline: Reference Checked, ECE Qualified (→advanced), Sensory-Aware Care (→advanced as Neurodiversity & Inclusive Practice). Added icons: `Moon`, `Baby`. Dropped: `PhoneCall`.
- **`TrustStandard.tsx`** Layer 5 Qualification Review `desc` — first aid readiness assessed at induction; certification within 4 months
- **`verification-process/page.tsx`** — Police Vetting `what` (obtained by NannyOra for every carer; vets not shareable across employers) + Qualification Review `what` (first aid induction + cert within 4 months)
- **Homepage FAQ** `faqItems[0].answer` — verification summary now mentions police vet + first aid readiness

### Phase 2 — Memberships + Bookings + Tiers + Payouts + SEO (commits `b7e50e5`–`de00ace`)

**Membership system (parent subscriptions):**
- **New `Membership` model** — 1:1 with User. Provider-agnostic (`provider`, `providerCustomerId`, `providerSubscriptionId`). `plan` (MONTHLY/QUARTERLY/ANNUAL), `status`, `currentPeriodEnd`, `cancelAtPeriodEnd`
- **`src/lib/membership.ts`** — `MEMBERSHIP_PLANS` ($39/$89/$149 NZD), `MEMBERSHIP_BENEFITS`, `getMembership()`, `requireMembership()` gate, `membershipEnforced()` soft-launch switch (`MEMBERSHIP_ENFORCED` env, off by default)
- **`src/server/actions/membership.ts`** — `startMembershipCheckout`, `cancelMembership`, `getPaymentOptions`, `getMyMembership`. Stale-session check (user exists in DB). Demo/backup IDs blocked from buying
- **New pages:** `/membership` (public plans + `PlanCards.tsx`), `/dashboard/parent/membership` + `MembershipPanel.tsx` (manage/cancel)
- **Webhook-only activation** — membership NOT activated on success URL; only the verified Stripe/PayPal webhook calls `activateMembership()`

**Payment provider layer:**
- **`src/lib/payments/types.ts`** — `PaymentProvider` interface (id, isConfigured, createMembershipCheckout, cancelMembership, createBookingCheckout, createTierCheckout). Adding a provider or flow = add a method + implement per provider
- **`src/lib/payments/stripe.ts`** — Stripe SDK provider. `refundStripe()` for booking refunds
- **`src/lib/payments/paypal.ts`** — PayPal plain-REST provider. `captureBookingOrder()`, `refundPaypalCapture()`, `sendPayout()` (PayPal Payouts API for nanny earnings)
- **`src/lib/payments/activate.ts`** — `activateMembership()`, `recordPayment()`, `deactivateMembership()` — called only by webhooks
- **`src/lib/payments/index.ts`** — `getProvider(id)`, `configuredProviders()`, `appUrl()`
- **New webhooks:** `/api/webhooks/stripe/route.ts`, `/api/webhooks/paypal/route.ts` — verify + activate memberships, settle bookings (→ REQUESTED) + tiers
- **New `Payment` model** — one row per charge, `kind` (MEMBERSHIP/BOOKING/DEPOSIT/PLACEMENT), `providerRef` (idempotency), `feeCents`, `status` (PENDING/PAID/FAILED/REFUNDED), `bookingId?`
- **New deps:** `stripe ^22.3.1`
- **New env vars:** `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`, `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`, `MEMBERSHIP_ENFORCED`

**Booking system (paid bookings with held funds + auto-payout):**
- **New `Booking` model** — parent books nanny hours. `subtotalCents`/`feeCents`/`totalCents`, full status workflow, `payoutStatus` (HELD/RELEASED/REFUNDED), `payoutReleaseAt`, `payoutRef`
- **`src/lib/booking.ts`** (PURE, client+server) — `SERVICE_FEE_PCT = 0.1`, `quoteBooking(rate, hours)` (fee-from-earnings: parent pays subtotal, 10% out of nanny earnings), `BookingStatus` + `BOOKING_TRANSITIONS` + `canTransition(from, to, role)`, `PAYOUT_HOLD_HOURS = 48`, self-check
- **`src/server/actions/booking.ts`** — `createBooking` (member-gated, PENDING_PAYMENT → webhook → REQUESTED), `acceptBooking`, `declineBooking` (refunds), `cancelBooking` (refunds), `completeBooking`, `approveBooking` (sets payoutReleaseAt), `getMyBookings`, `getNannyBookings`
- **New `BookingWidget.tsx`** on nanny profile — date/hours/payment picker
- **New `BookingsClient.tsx`** — shared bookings list + status actions (nanny/parent dashboards)
- **New pages:** `/dashboard/nanny/bookings`, `/dashboard/parent/bookings`
- **Refunds on decline/cancel** — Stripe refund / PayPal capture refund; parent gets money back

**Nanny pricing tiers (one-time upfront):**
- **New `NannyProfile` fields:** `tier` (NONE/LISTED/PREMIUM), `tierPaidAt`, `payoutPaypalEmail`
- **`src/lib/tiers.ts`** — `NANNY_TIERS` (LISTED $50, PREMIUM $200 incl. First Aid), `tierRank()` (Premium=2, Listed=1, NONE=0) for search priority sort
- **`src/server/actions/tier.ts`** — `startTierCheckout` (NANNY-only, not demo/backup), `getMyTier`
- **New pages:** `/dashboard/nanny/tier` + `TierCards.tsx`
- **Directory sort** — `getPublicNannies` now tier-sorts: Premium floats above Listed above unpaid, newest-first within a tier

**Payouts (cron-driven nanny earnings release):**
- **`src/server/actions/payouts.ts`** — `releaseDuePayouts(limit=50)`. Due = COMPLETED + HELD + past `payoutReleaseAt` + nanny has PayPal email. Idempotent: claim-then-send (HELD→RELEASED before PayPal call), `senderItemId = booking_${id}` is PayPal idempotency key. No email → skipped. Failure → rolls claim back to HELD
- **`/api/cron/payouts/route.ts`** — `CRON_SECRET`-gated. Vercel Cron daily at 03:00 UTC (`vercel.json`)
- **`src/server/actions/money.ts`** — `getMoneyOverview` (ADMIN): platform revenue (membership + tier + booking **fee**, not gross), gross processed, paid out, held for nannies, counts, recent 12 payments
- **New page:** `/admin/money` — admin money dashboard

**Name-based nanny profile URLs (slugs):**
- **New `NannyProfile.slug`** — unique, name-based permalink ("jessie-wu")
- **`src/lib/slug.ts`** — `slugify(name)` (accent-stripping), `looksLikeCuid()`. Pure, client+server
- **`uniqueNannySlug(name)`** in `nanny.ts` — appends `-2`, `-3` on collision. Called in `applyAsNanny`
- **`getPublicNannyById(slugOrId)`** — looks up by `slug OR id` so old cuid links still resolve
- **`getPublicNannies`** returns `slug ?? id` so links always work

**Member gating wired into existing actions:**
- `requireMembership()` added to: `createEnquiry`, `toggleFavourite`, `createJobPost`, `getConversation`, `sendMessage`, `createBooking`. Off until `MEMBERSHIP_ENFORCED=true`
- `ActionResult` gained `upgradeRequired?: boolean` — UI shows `UpgradeGate` modal instead of error toast
- **`src/components/membership/UpgradeGate.tsx`** — upgrade modal, shown when action returns `upgradeRequired`

**Comprehensive technical SEO (commit `de00ace`):**
- **`src/app/robots.ts`** — robots.txt (disallow /dashboard, /admin, /api, login routes)
- **`src/app/sitemap.ts`** — sitemap.xml (static pages + suburb SEO pages + approved nanny profiles, `take: 200`)
- **`src/app/opengraph-image.tsx`** — dynamic OG image via `ImageResponse`
- **`src/lib/seo.ts`** — schema.org builders: Organization, WebSite, ChildCare LocalBusiness, Breadcrumb, Person (nanny + aggregateRating), FAQPage
- **`src/components/seo/JsonLd.tsx`** — injects JSON-LD into page `<head>`
- **`src/app/layout.tsx`** — added Organization + WebSite + LocalBusiness JSON-LD site-wide
- **New page layouts with SEO metadata:** `apply-as-nanny/layout.tsx`, `post-a-job/layout.tsx`, `register-family/layout.tsx`, `how-it-works/page.tsx`
- **Enquiry email field clarified** — `EnquiryForm.tsx` label now "Your email (for your receipt)" (was ambiguous)

**Resilience fixes:**
- **Stale session handling** (commit `0be5e90`) — payment flows check user still exists in DB before checkout; return "session out of date" instead of failing at activation
- **Stripe membership return-path fallback** (commit `a611401`) — webhook is primary, but return path also activates as a fallback if webhook hasn't fired yet (resilience against webhook delay/failure)
- **PayPal membership activation on return** (commit `e8bc304`) — activates on return path, not just via webhook
- **Refund parent on declined/cancelled booking** (commit `f94b0bd`) — `declineBooking` + `cancelBooking` call `refundStripe` / `refundPaypalCapture`
- **Daily payout cron on Hobby plan** (commit `5405469`) — Vercel Hobby limits cron to daily; the 48h hold makes daily sweeps fine (payouts lag up to ~24h past release time)
- **Nanny payouts + fee-from-earnings + admin money + photo gate** (commit `d465096`) — full payout flow, `BookingWidget` photo gate (nanny needs a profile photo before bookings appear), `MembershipPanel`, `TierCards`, admin money dashboard
