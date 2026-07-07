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

### Vercel Production Env Vars
Set on Vercel project `nanny-ora` for the Production environment:
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_VERIFICATION`, `EMAIL_FROM_ADMIN`, `ADMIN_EMAIL`
- `ADMIN_BACKUP_EMAIL`, `ADMIN_BACKUP_PASSWORD`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`

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
│   ├── seed.ts                # Seeds demo admin/nanny/parent + sample data
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
│   │   ├── api/auth/[...nextauth]/route.ts  # Auth handlers (3 lines)
│   │   ├── (public)/          # Public marketing + listing pages
│   │   │   ├── layout.tsx     # Shared public layout
│   │   │   ├── page.tsx       # Homepage (SERVER)
│   │   │   ├── apply-as-nanny/page.tsx    # Nanny application form (CLIENT, 844 lines)
│   │   │   ├── register-family/page.tsx   # Parent registration (CLIENT)
│   │   │   ├── find-a-nanny/page.tsx             # Nanny directory wrapper (SERVER, 16 lines, metadata + revalidate=300)
│   │   │   ├── find-a-nanny/FindANannyClient.tsx # Filter sidebar + results grid (CLIENT, 455 lines)
│   │   │   ├── post-a-job/page.tsx        # Job posting form (CLIENT)
│   │   │   ├── pricing/page.tsx           # Pricing (SERVER)
│   │   │   ├── how-it-works/page.tsx      # How it works (SERVER)
│   │   │   ├── trust-and-safety/page.tsx  # Trust & safety (SERVER)
│   │   │   ├── verification-process/page.tsx  # Detailed 7-layer verification process (SERVER, 232 lines)
│   │   │   ├── childcare-support/page.tsx    # Childcare support options info page (SERVER, 81 lines)
│   │   │   ├── nannies/[id]/page.tsx      # Nanny detail (SERVER, 264 lines)
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
│   │   │   └── enquiries/[id]/page.tsx # Admin conversation viewer (CLIENT, ConversationThread wrapper)
│   │   └── dashboard/         # User dashboards (role-guarded)
│   │       ├── layout.tsx     # Shared dashboard shell — unread message badge in nav (CLIENT)
│   │       ├── nanny/page.tsx # Nanny dashboard — live stats from getNannyDashboard (CLIENT)
│   │       ├── nanny/enquiries/page.tsx    # Nanny message inbox (ConversationList wrapper)
│   │       ├── nanny/enquiries/[id]/page.tsx # Nanny conversation thread (ConversationThread wrapper)
│   │       ├── nanny/profile/page.tsx      # Profile editor wrapper (SERVER, 133 lines)
│   │       ├── nanny/profile/ProfileForm.tsx # Profile editor form (CLIENT, 816 lines)
│   │       ├── parent/page.tsx # Parent dashboard — live stats from getParentDashboard (CLIENT)
│   │       ├── parent/messages/page.tsx    # Parent message inbox (ConversationList wrapper)
│   │       ├── parent/messages/[id]/page.tsx # Parent conversation thread (ConversationThread wrapper)
│   │       └── parent/profile/page.tsx # Parent profile editor (CLIENT, 142 lines)
│   ├── components/
│   │   ├── providers/Providers.tsx   # SessionProvider + ToastProvider
│   │   ├── layout/                   # Header, Footer, MobileBottomNav
│   │   ├── cards/NannyCard.tsx       # Nanny listing card
│   │   ├── cards/FavouriteButton.tsx # Optimistic heart toggle (PARENT only)
│   │   ├── home/                     # InteractiveHero, BentoFeatures, MarqueeTestimonials, StatsTicker, TrustStrip, TrustStandard, SpecialistExpertise, DayInLife, LifestyleGallery
│   │   ├── messaging/                # ConversationList (inbox), ConversationThread (chat view)
│   │   └── ui/                       # Button, Input, Select, Textarea, Card, Badge (+VerificationBadge), Accordion, Toast (+useToast hook), Reveal, ShinyText, BorderBeam, ImageBand, TagInput
│   ├── lib/
│   │   ├── utils.ts                  # cn(), formatRate(), getInitials()
│   │   ├── constants/index.ts        # All enums, lists, options (care types, suburbs, safety checks, regions, language tags, etc.)
│   │   ├── validations/index.ts      # Zod schemas (parentIntake, nannyApplication, jobPost, enquiry, referee)
│   │   ├── auth/auth.ts             # NextAuth config
│   │   ├── db/prisma.ts             # Prisma client singleton
│   │   ├── supabase/server.ts       # Server Supabase client (service role key) — browser client deleted
│   │   ├── email/                    # Resend lifecycle email system (sendEmail + 13 lifecycle templates + escapeHtml + emailShell)
│   │   ├── sms/                      # Twilio SMS via plain REST (sendSms) + NZ phone normaliser (toE164NZ)
│   │   ├── moderation.ts            # detectContactInfo() — flags email/phone in messages (de-obfuscates "at"/"dot"/spelled digits)
│   │   ├── images.ts                # Tagged local image library + pickImages() deterministic seeded picker
│   │   ├── data/sample-nannies.ts   # Dev sample data (10 mock nannies + filterNannies + NannyFilters type)
│   │   └── data/nannies.ts          # DB-backed public nanny directory (getPublicNannies, getPublicNannyById, getNannyReviews) — falls back to sample data
│   └── server/actions/              # Server Actions (all use "use server")
│       ├── auth.ts                  # Exports ActionResult type only (registerUser deleted; signups via registerParent/applyAsNanny)
│       ├── nanny.ts                 # applyAsNanny, updateNannyProfile, uploadNannyDocument, deleteNannyDocument, getNannyDocuments, uploadProfilePhoto, setProRegApplicability
│       ├── parent.ts                # registerParent, updateParentProfile, getMyParentProfile
│       ├── job.ts                   # createJobPost, updateJobStatus, getJobPosts, applyToJob
│       ├── enquiry.ts               # createEnquiry, updateEnquiryStatus, getEnquiries
│       ├── engagement.ts            # toggleFavourite, getFavouriteIds, recordProfileView, getNannyDashboard, getParentDashboard, getMyNannyEnquiries
│       ├── messages.ts              # getConversation, sendMessage, getMyConversations, getUnreadTotal
│       ├── password.ts              # requestPasswordReset, resetPassword
│       ├── reviews.ts               # createReview
│       └── admin.ts                 # updateNannyStatus, updateVerificationLevel, reviewDocument, updateSafetyCheckStatus, getAdminStats, getAdminNannies, getDocumentDownloadUrl
├── next.config.ts                   # serverActions.bodySizeLimit: 10mb, images, turbopack
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

### Models

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

Relations: `parentProfile?`, `nannyProfile?`, `jobPosts[]`, `enquiriesSent[]`, `reviewsGiven[]`, `favourites[]` (FavouritesByParent), `profileViews[]` (ViewsByUser), `messagesSent[]` (MessagesSent), `conversationReads[]` (ConversationReads)

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

#### `NannyProfile` → table `nanny_profiles` (core model, ~45 fields)
| Field Group | Fields | Notes |
|---|---|---|
| Identity | `id`, `userId` (unique FK→User), `profileImageUrl?` | |
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
| Timestamps | `createdAt`, `updatedAt` | |
| Engagement | `favouritedBy` (Favourite[]), `views` (ProfileView[]), `jobApplications[]` | Relations |

> **JSON-as-string pattern:** Arrays (careTypes, availability, specialistTags, areasCovered, refereeData, languages, etc.) are stored as `JSON.stringify()` strings in `String` columns, not native Postgres arrays. Read/write code must `JSON.parse()` / `JSON.stringify()`.

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
type ActionResult = { success: boolean; error?: string; data?: any };
```

### Auth (`src/lib/auth/auth.ts`)
Exports only the `ActionResult` type. `registerUser` was deleted — signups now flow through `registerParent` and `applyAsNanny`.

**NextAuth config:** JWT session with `maxAge: 7 days`. `AUTH_SECRET` is required (throws on startup if unset — no hardcoded fallback). Emergency backup admin account works without DB (credentials via `ADMIN_BACKUP_EMAIL` / `ADMIN_BACKUP_PASSWORD` env vars). The old `demo1234` universal password bypass was removed.

### Nanny (`src/server/actions/nanny.ts`)
| Function | Auth | Description |
|---|---|---|
| `applyAsNanny(input)` | Public | Validates, checks existing email, hashes password, validates doc files (5MB max, PDF/JPG/PNG/WebP), uploads docs to Supabase Storage, transactionally creates User + NannyProfile + NannyDocuments. Stores police vet authorization. Sends welcome + admin notification emails. |
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
| `createJobPost(input)` | Logged in (any role) | Creates JobPost (PENDING), emails admin |
| `updateJobStatus(jobId, status)` | ADMIN | Updates status, emails parent |
| `getJobPosts(filters?)` | ADMIN | Returns job posts with optional filters. `take: 50` limit. Includes parent email PII + applications (with nanny names, `take: 20`) |
| `applyToJob(jobId)` | NANNY | One-click application to an APPROVED job. Idempotent per (job, nanny). Notifies admin |

### Enquiry (`src/server/actions/enquiry.ts`)
| Function | Auth | Description |
|---|---|---|
| `createEnquiry(input)` | Logged in (any role) | Zod validates, flags contact info via `detectContactInfo()`, creates Enquiry (status NEW, `flagged` field), stores `contactEmail`/`contactPhone` (admin-only), emails parent receipt + notifies admin |
| `updateEnquiryStatus(enquiryId, status)` | ADMIN | Updates status, emails parent |
| `getEnquiries(filters?)` | ADMIN | Returns enquiries with optional filters. `take: 50` limit. Includes parent name + email PII + flagged message counts |

### Engagement (`src/server/actions/engagement.ts`) (NEW)
| Function | Auth | Description |
|---|---|---|
| `toggleFavourite(nannyId)` | PARENT | Saves/unsaves a nanny. Returns `{ favourited: boolean }` |
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

### Messages (`src/server/actions/messages.ts`) (NEW — Fiverr-style in-app chat)
| Function | Auth | Description |
|---|---|---|
| `getConversation(enquiryId)` | PARENT/NANNY/ADMIN (party to enquiry) | Returns seed message + all replies (oldest first, `take: 200`). Non-admin: marks conversation as read via `ConversationRead` upsert |
| `sendMessage(enquiryId, body)` | PARENT/NANNY (not admin) | Validates body (max 2000 chars), 2s anti-spam throttle, flags contact info via `detectContactInfo()`, creates `Message`, bumps enquiry `updatedAt`. Notifies other party: email every message + SMS throttled to 10min digest |
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
- **Safety check statuses:** NOT_STARTED, SUBMITTED, VERIFIED, REJECTED
- **Document review statuses:** PENDING, APPROVED, REJECTED
- **Nanny admin statuses:** DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, VERIFIED, SPECIALIST, SUSPENDED, ARCHIVED
- **Verification levels:** LISTED, VERIFIED, PREMIUM_VETTED, SPECIALIST
- **Job post statuses:** PENDING, APPROVED, CLOSED, REJECTED
- **Enquiry statuses:** NEW, CONTACTED, MATCHED, CLOSED

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

### DB-Seeded Demo Accounts (require database)
| Role | Email | Password |
|---|---|---|
| Nanny | `emma@nannyora.co.nz` | `demo1234` |
| Parent | `parent@nannyora.co.nz` | `demo1234` |

Seeded by `prisma/seed.ts` with proper bcrypt hashes. These accounts require the database to be reachable — they use standard bcrypt password comparison, no bypass. The admin seed account (`admin@nannyora.co.nz`) also exists in the DB but the env-backed backup above takes priority if the DB is down.

---

## 13. Deployment

- **Platform:** Vercel (connected to GitHub repo `Zreeshah/nanny-ora`)
- **Auto-deploy:** On push to `main` branch
- **Production URL:** https://nanny-ora.vercel.app
- **Build command:** `next build` (with `postinstall: prisma generate`)
- **Node version:** 24.x

### Database Management
```bash
# Apply schema changes to Supabase
npm run db:push

# Seed demo data
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

---

## 15. Known Limitations & Future Work

- **Preview deployments** on Vercel may fail — Preview environment is missing `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `AUTH_TRUST_HOST` (only Production has them)
- **`deleteNannyDocument`** removes the DB record but does NOT delete the file from Supabase Storage (orphaned files accumulate)
- **`uploadProfilePhoto`** with extension change leaves the old file orphaned in Storage
- **Post-commit email bug** — `applyAsNanny`, `registerParent`, `createEnquiry`, `createJobPost`, and admin status updates all `await` emails after the DB write. If email throws, client sees failure but the DB mutation already committed. Should use per-send try/catch or `Promise.allSettled`
- **`createEnquiry` / `createJobPost`** accept any logged-in role (should be PARENT-only); `contactEmail` comes from input, not session (spoofable)
- **View throttle + message throttle + SMS throttle are in-memory** — won't survive restarts or work across serverless instances. Upgrade to Redis/Upstash if rate-limiting needs to be strict
- **`SkillTag` model** exists in schema but is unused (specialist tags are hardcoded in constants, not DB-driven)
- **No payment integration** — the pricing page is informational only
- **`lucide-react` v1.18.0** — unusual version pin (latest is v0.x); may have API differences
- **Lint has ~574 errors** — mostly `@typescript-eslint/no-explicit-any` on `(session.user as any).role` patterns; not blocking builds
- **SEO landing pages** (`/ece-nanny-auckland`, etc.) are statically rendered and don't pull from the database
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
- **Auckland regions** — new `AUCKLAND_REGIONS` + `SUBURB_TO_REGION` mapping in constants; filter by Central / East / North Shore / West / South
- **Language immersion** — new `LANGUAGE_TAGS` constant (Mandarin, Cantonese, Korean, Japanese, Spanish, Te Reo Māori); new `languages: string[]` field on `NannyProfilePublic`; language immersion badges rendered on `NannyCard`
- **Child age filter** — maps age ranges to existing specialist tags via heuristic (`AGE_TO_TAG` — newborn/infant/toddler→`baby_experience`, preschool→`ece_background`, school_age/teenager→`after_school_care`)
- **Childcare support note** — replaced government funding note with softer "Childcare Support Options" info box linking to `/childcare-support`
- **Sample data** — added `languages` to all 10 sample nannies (Lily Chen→Mandarin, Grace Taylor→Korean, Hannah Patel→Te Reo Māori, Rachel Foster→Spanish, others→empty)

### DB-Backed Nanny Directory (`src/lib/data/nannies.ts`)
- **New data layer** — `getPublicNannies()` queries Prisma for APPROVED/VERIFIED/SPECIALIST nannies, falls back to sample data when DB is empty or unreachable
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
- **`AUCKLAND_SUBURBS`** removed from imports in all 5 form files; stays in `constants/index.ts` (SEO pages + `SUBURB_TO_REGION` still reference it)

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
