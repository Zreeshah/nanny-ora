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
- **File Storage:** Supabase Storage (private bucket `nanny-documents`)

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

### Build Scripts
```
npm run dev       → next dev --webpack
npm run build     → next build
npm run start     → next start
npm run lint      → eslint
npm run db:push   → prisma db push --skip-generate
npm run db:seed   → tsx prisma/seed.ts
postinstall       → prisma generate
```

### Key Config
- **`next.config.ts`**: `serverActions.bodySizeLimit: "10mb"` (raised from 1MB default for document uploads); `images.remotePatterns` whitelists `images.pexels.com` only
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

### Vercel Production Env Vars
Set on Vercel project `nanny-ora` for the Production environment:
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

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

### Demo Mode
The `authorize()` function has a fallback for password `"demo1234"`:
1. Tries DB lookup by email first → returns real user if found
2. Falls back to hardcoded demo accounts if DB is unreachable:
   - `admin@nannyora.co.nz` → id "demo-admin", role ADMIN
   - `emma@nannyora.co.nz` → id "demo-nanny", role NANNY
   - `parent@nannyora.co.nz` → id "demo-parent", role PARENT

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
│   │   ├── api/auth/[...nextauth]/route.ts  # Auth handlers (3 lines)
│   │   ├── (public)/          # Public marketing + listing pages
│   │   │   ├── layout.tsx     # Shared public layout
│   │   │   ├── page.tsx       # Homepage (SERVER)
│   │   │   ├── apply-as-nanny/page.tsx    # Nanny application form (CLIENT, 844 lines)
│   │   │   ├── register-family/page.tsx   # Parent registration (CLIENT)
│   │   │   ├── find-a-nanny/page.tsx             # Nanny directory wrapper (SERVER, 16 lines, metadata + revalidate=300)
│   │   │   ├── find-a-nanny/FindANannyClient.tsx # Filter sidebar + results grid (CLIENT, 448 lines)
│   │   │   ├── post-a-job/page.tsx        # Job posting form (CLIENT)
│   │   │   ├── pricing/page.tsx           # Pricing (SERVER)
│   │   │   ├── how-it-works/page.tsx      # How it works (SERVER)
│   │   │   ├── trust-and-safety/page.tsx  # Trust & safety (SERVER)
│   │   │   ├── verification-process/page.tsx  # Detailed 7-layer verification process (SERVER, 232 lines)
│   │   │   ├── childcare-support/page.tsx    # Childcare support options info page (SERVER, 81 lines)
│   │   │   ├── nannies/[id]/page.tsx      # Nanny detail (SERVER)
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
│   │   │   └── enquiries/page.tsx # Enquiry management — parent→nanny flow (CLIENT)
│   │   └── dashboard/         # User dashboards (role-guarded)
│   │       ├── layout.tsx     # Shared dashboard shell (CLIENT)
│   │       ├── nanny/page.tsx # Nanny dashboard (CLIENT)
│   │       ├── nanny/profile/page.tsx      # Profile editor wrapper (SERVER)
│   │       ├── nanny/profile/ProfileForm.tsx # Profile editor form (CLIENT, 816 lines)
│   │       └── parent/page.tsx # Parent dashboard (CLIENT)
│   ├── components/
│   │   ├── providers/Providers.tsx   # SessionProvider + ToastProvider
│   │   ├── layout/                   # Header, Footer, MobileBottomNav
│   │   ├── cards/NannyCard.tsx       # Nanny listing card
│   │   ├── home/                     # InteractiveHero, BentoFeatures, MarqueeTestimonials, StatsTicker, TrustStrip, TrustStandard, SpecialistExpertise, DayInLife, LifestyleGallery
│   │   └── ui/                       # Button, Input, Select, Textarea, Card, Badge (+VerificationBadge), Accordion, EmptyState, LoadingSpinner, Toast (+useToast hook), Reveal, ShinyText, BorderBeam, ImageBand
│   ├── lib/
│   │   ├── utils.ts                  # cn(), formatRate(), getInitials()
│   │   ├── constants/index.ts        # All enums, lists, options (care types, suburbs, safety checks, regions, language tags, etc.)
│   │   ├── validations/index.ts      # Zod schemas (login, register, parentIntake, nannyApplication, jobPost, enquiry, referee)
│   │   ├── auth/auth.ts             # NextAuth config
│   │   ├── db/prisma.ts             # Prisma client singleton
│   │   ├── supabase/browser.ts      # Browser Supabase client (anon key)
│   │   ├── supabase/server.ts       # Server Supabase client (service role key)
│   │   ├── email/                    # Resend email integration (sendEmail, sendRefereeRequests, escapeHtml)
│   │   ├── images.ts                # Tagged local image library + pickImages() deterministic seeded picker
│   │   ├── data/sample-nannies.ts   # Dev sample data (10 mock nannies + filterNannies)
│   │   └── data/nannies.ts          # DB-backed public nanny directory (getPublicNannies, getPublicNannyById) — falls back to sample data
│   └── server/actions/              # Server Actions (all use "use server")
│       ├── auth.ts                  # registerUser
│       ├── nanny.ts                 # applyAsNanny, updateNannyProfile, uploadNannyDocument, deleteNannyDocument, getNannyDocuments
│       ├── parent.ts                # registerParent, updateParentProfile
│       ├── job.ts                   # createJobPost, updateJobStatus, getJobPosts
│       ├── enquiry.ts               # createEnquiry, updateEnquiryStatus, getEnquiries
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
| `createdAt` / `updatedAt` | DateTime | |

Relations: `parentProfile?`, `nannyProfile?`, `jobPosts[]`, `enquiriesSent[]`, `reviewsGiven[]`

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
| Boolean flags | `eceExperience`, `neurodiverseExperience`, `firstAidCurrent`, `driverLicence` | |
| Referee data | `refereeData` (JSON string of `{name, phone, email, relationship}[]`) | |
| Verification | `verificationLevel` (default "LISTED") | LISTED/VERIFIED/PREMIUM_VETTED/SPECIALIST |
| Admin status | `adminStatus` (default "SUBMITTED") | DRAFT/SUBMITTED/UNDER_REVIEW/APPROVED/VERIFIED/SPECIALIST/SUSPENDED/ARCHIVED |
| **7 Safety checks** | `identityVerified`, `workHistoryVerified`, `proRegVerified`, `refereeCheckStatus`, `policeVetStatus`, `interviewStatus`, `riskAssessmentStatus` | Each: NOT_STARTED/SUBMITTED/VERIFIED/REJECTED |
| **Police vet auth** | `policeVetAuthorized` (Boolean), `policeVetAuthorizedAt` (DateTime?) | Children's Act 2014 consent |
| Timestamps | `createdAt`, `updatedAt` | |

> **JSON-as-string pattern:** Arrays (careTypes, availability, specialistTags, areasCovered, refereeData, etc.) are stored as `JSON.stringify()` strings in `String` columns, not native Postgres arrays. Read/write code must `JSON.parse()` / `JSON.stringify()`.

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

#### `Enquiry` → table `enquiries`
| Field | Type | Notes |
|---|---|---|
| `id`, `parentId` (FK→User), `nannyId` (FK→NannyProfile) | String | |
| `message` | String | |
| `status` | String | Default "NEW" — NEW/CONTACTED/MATCHED/CLOSED |

#### `Review` → table `reviews` (placeholder for Phase 2)
| Field | Type | Notes |
|---|---|---|
| `id`, `parentId` (FK→User), `nannyId` (FK→NannyProfile) | String | |
| `rating` | Int | Default 5 |
| `comment` | String | |

#### `SkillTag` → table `skill_tags`
| Field | Type | Notes |
|---|---|---|
| `id`, `name` (unique), `category` (default "general") | String | general/specialist/qualification |

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

---

## 9. Server Actions API

All server actions use `"use server"` directive and return `ActionResult` type:
```typescript
type ActionResult = { success: boolean; error?: string; data?: any };
```

### Auth (`src/server/actions/auth.ts`)
| Function | Auth | Description |
|---|---|---|
| `registerUser(input)` | Public | Zod validates, bcrypt hashes, creates User. Returns `{userId, role}` |

### Nanny (`src/server/actions/nanny.ts`)
| Function | Auth | Description |
|---|---|---|
| `applyAsNanny(input)` | Public | Validates, checks existing email, hashes password, uploads docs to Supabase Storage, transactionally creates User + NannyProfile + NannyDocuments. Stores police vet authorization. |
| `updateNannyProfile(updates)` | NANNY | Transactionally updates User (name/phone) + upserts NannyProfile |
| `uploadNannyDocument(documentType, file)` | NANNY | Uploads File to Storage, creates NannyDocument, auto-updates safety check status |
| `deleteNannyDocument(documentId)` | NANNY | Verifies ownership, deletes PENDING docs only (DB record, not Storage file) |
| `getNannyDocuments()` | NANNY | Returns all documents for logged-in nanny |

### Parent (`src/server/actions/parent.ts`)
| Function | Auth | Description |
|---|---|---|
| `registerParent(input)` | Public | Creates User (PARENT) + ParentProfile |
| `updateParentProfile(data)` | PARENT | Updates ParentProfile fields |

### Job (`src/server/actions/job.ts`)
| Function | Auth | Description |
|---|---|---|
| `createJobPost(input)` | Logged in | Creates JobPost with status "PENDING" |
| `updateJobStatus(jobId, status)` | ADMIN | Updates job status |
| `getJobPosts(filters?)` | Public | Returns job posts with optional filters |

### Enquiry (`src/server/actions/enquiry.ts`)
| Function | Auth | Description |
|---|---|---|
| `createEnquiry(input)` | Logged in | Creates Enquiry with status "NEW" |
| `updateEnquiryStatus(enquiryId, status)` | ADMIN | Updates enquiry status |
| `getEnquiries(filters?)` | Public | Returns enquiries with optional filters |

### Admin (`src/server/actions/admin.ts`)
| Function | Auth | Description |
|---|---|---|
| `updateNannyStatus(nannyProfileId, adminStatus)` | ADMIN | Updates nanny's adminStatus |
| `updateVerificationLevel(nannyProfileId, level)` | ADMIN | Sets verification level |
| `reviewDocument(documentId, reviewStatus)` | ADMIN | Approves/rejects document, stamps reviewer |
| `updateSafetyCheckStatus(nannyProfileId, checkField, status)` | ADMIN | Updates one of the 7 safety check fields |
| `getAdminStats()` | ADMIN | Returns dashboard counts |
| `getAdminNannies(filters?)` | ADMIN | Returns all nanny profiles with user + documents |
| `getDocumentDownloadUrl(documentId)` | ADMIN | Generates 5-minute signed Storage URL |

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

## 12. Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@nannyora.co.nz` | `demo1234` |
| Nanny | `emma@nannyora.co.nz` | `demo1234` |
| Parent | `parent@nannyora.co.nz` | `demo1234` |

These are seeded by `prisma/seed.ts` and also hardcoded as fallbacks in the auth `authorize()` function for when the database is unreachable.

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
3. **Server-side file uploads** — Files are uploaded to Supabase Storage server-side using the service_role key (never exposed to browser); the anon key/browser client exists but is reserved for future use
4. **Private storage bucket** — Vetting documents are private; admin downloads use 5-minute signed URLs generated server-side
5. **7-step safety vetting** — Structured workflow mapping document types to check status fields; steps 6-7 are admin-only
6. **Police vetting authorization** — Required consent checkbox (Children's Act 2014) on the nanny application; stored with timestamp for compliance
7. **Demo mode fallback** — Auth gracefully degrades when database is unreachable using hardcoded demo accounts
8. **Route protection** — `src/proxy.ts` middleware guards `/admin/*` and `/dashboard/*` by role using JWT token inspection

---

## 15. Known Limitations & Future Work

- **Preview deployments** on Vercel may fail — Preview environment is missing `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `AUTH_TRUST_HOST` (only Production has them)
- **`deleteNannyDocument`** removes the DB record but does NOT delete the file from Supabase Storage (orphaned files accumulate)
- **`Review` model** exists in schema but is unused (placeholder for Phase 2)
- **`SkillTag` model** exists in schema but is unused (specialist tags are hardcoded in constants, not DB-driven)
- **No messaging system** — enquiries are one-shot messages, not threaded conversations
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
- **`languages: []`** hardcoded with `ponytail:` comment — no `languages` column in DB schema yet
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
