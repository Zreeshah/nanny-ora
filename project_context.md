# NannyOra — Project Context Document

This document provides a comprehensive overview of the **NannyOra** web application's architecture, technology stack, directory structure, database models, and design system to serve as a context reference for other tools or LLMs.

---

## 1. Project Overview
**NannyOra** is a premium, localized web platform designed to connect families in Auckland, New Zealand, with trusted, qualified, and specialist carers. The platform focuses heavily on nannies with specialized training, such as **sensory-aware care**, **neurodiverse support (autism/ADHD)**, and **Early Childhood Education (ECE)** backgrounds.

---

## 2. Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19 & TypeScript
- **Styling:** Tailwind CSS v4
- **Database Engine:** PostgreSQL via **Supabase** (Transitioned from local SQLite)
- **Database ORM:** Prisma Client
- **Authentication:** NextAuth.js v5 (Auth.js) with JWT strategy and credentials provider
- **Form Validation:** Zod

---

## 3. Core Architecture & Features

### 3.1. User Roles & Pathways
- **Parent/Family (`role: "PARENT"`):**
  - Registration intake flow at `/register-family` (captures suburb, age of children, care type required, and special needs).
  - Can view listings, search/filter nannies, post jobs, and send enquiries.
- **Nanny/Carer (`role: "NANNY"`):**
  - Application intake flow at `/apply-as-nanny`.
  - Access to a private Nanny Dashboard (`/dashboard/nanny`) to view stats, matching job postings, and incoming parent enquiries.
  - Can manage profile credentials, availability, rates, and bios at `/dashboard/nanny/profile`.
- **Admin (`role: "ADMIN"`):**
  - Moderates and approves nanny applications, verifies certifications (IDs, Police Vetting checks, First Aid Certs), and manages tags.

### 3.2. Authentication & Session Lifecycles
Authentication is handled via NextAuth. Custom token and session callbacks expose the user's database `id` and `role` to the client and server components.
- **Demo Mode Credentials:** The authentication system has fallback credentials (`password: "demo1234"`) for local testing. It queries the database first to find the real user ID, falling back to static strings (`demo-nanny`, `demo-parent`, `demo-admin`) if the database is offline/unseeded.

---

## 4. Key Directories & File Structure

```text
nannyora/
├── prisma/
│   ├── schema.prisma       # Prisma Database schema (PostgreSQL)
│   └── seed.ts             # Script to seed demo admin, parent, and nanny accounts
├── public/
│   ├── logo.png            # Tightly cropped branding logo with tagline
│   └── logo-circle.jpg     # Circular sticker brand badge
├── src/
│   ├── app/                # Next.js App Router Pages & Routes
│   │   ├── (public)/       # Static landing pages (Trust & Safety, Pricing, How it Works)
│   │   │   ├── register-family/    # Family sign up
│   │   │   └── apply-as-nanny/     # Nanny application form
│   │   ├── admin/          # Admin moderation interfaces
│   │   ├── api/            # API Route handlers (Auth handlers)
│   │   ├── dashboard/      # User Dashboards (shared layout.tsx)
│   │   │   ├── nanny/      # Nanny Dashboard (page.tsx, /profile editor)
│   │   │   └── parent/     # Parent Dashboard
│   │   ├── login/          # Custom sign-in form page
│   │   ├── globals.css     # Tailwind v4 theme variables and base styles
│   │   └── layout.tsx      # Main layout wrapper and viewport metadata
│   ├── components/         # Reusable Component Layer
│   │   ├── layout/         # Header.tsx, Footer.tsx (with brand logo)
│   │   ├── ui/             # Design System primitives (Button, Input, Select, Textarea, Card, Toast)
│   │   └── home/           # Homepage sections (Bento features, Testimonials, Hero)
│   ├── lib/                # Utility Libraries
│   │   ├── auth/           # NextAuth handler config
│   │   ├── db/             # Prisma client initialization
│   │   ├── validations/    # Zod schemas for input validation
│   │   └── constants/      # Lists for Auckland suburbs, tags, rate limits, and options
│   └── server/             # Server Action Layer
│       └── actions/        # Secure Server Actions (auth.ts, nanny.ts, parent.ts)
```

---

## 5. Database Schema Details (Prisma)

- **`User` model:** Holds auth details. Uniquely keyed on `email`. Fields include `name`, `phone`, `role` (PARENT/NANNY/ADMIN), and relation fields pointing to profiles.
- **`ParentProfile` model:** Linked 1-to-1 with `User`. Stores `suburb`, `preferredDays`, and stringified JSON arrays for `childAgeRange` and `careTypeNeeded`.
- **`NannyProfile` model:** Linked 1-to-1 with `User`. Stores `suburb`, `yearsExperience`, `hourlyRate`, `bio`, and boolean flags for checks (`eceExperience`, `neurodiverseExperience`, `firstAidCurrent`, `driverLicence`). Stores `areasCovered`, `careTypes`, `availability`, and `specialistTags` as JSON strings for quick, cross-platform serialisation.
- **`NannyDocument` model:** Stores uploaded vetting credentials linked to a nanny profile. Types include `ID`, `REFERENCES`, `FIRST_AID_CERT`, `POLICE_VET`, and `TEACHER_REGISTRATION` with approval statuses (`PENDING`, `APPROVED`, `REJECTED`).
- **`JobPost` model:** Stores parent job postings. Includes title, suburb, careType, budget, and child details.
- **`Enquiry` model:** Handles enquiries sent from parents to nannies (`NEW`, `CONTACTED`, `MATCHED`, `CLOSED`).

---

## 6. Design System & Aesthetics (Tailwind v4 theme)

NannyOra uses a customized HSL warm and trustworthy palette configured via CSS variables in [`globals.css`](file:///Users/resilient/Documents/Project%20nanny/nannyora/src/app/globals.css):

- **Theme Colors:**
  - `--background: #FDFBF7` (Soft warm off-white cream matching the textured logo card background).
  - `--foreground: #0C1E36` (Midnight dark navy blue for high-contrast headers).
  - `--primary: #0F2E52` (Deep care navy for branding, active states, and links).
  - `--secondary: #F4EFE6` (Sand-beige background panels and containers).
  - `--accent: #B88A58` (Curated warm bronze/caramel accent taken from the "ora" logo text).
  - `--muted-foreground: #5B6D80` (Muted gray-blue for body text).
  - `--border: #E8E2D5` (Soft warm divider borders).
- **Typography:** Custom google fonts `Outfit` (headings) and `Plus Jakarta Sans` (body) configured with responsive size adjustments.
- **Visuals:** Large child-friendly rounded corners (`--radius-xl: 32px`), organic blob animations, and glassmorphism headers.
