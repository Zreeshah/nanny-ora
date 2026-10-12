# AI Search Implementation Report

Date: 13 October 2026
Status: local changes validated; not deployed.

## Implemented safe fixes

### Index quality and local inventory

- Added `src/lib/location-coverage.ts` as the shared profile-coverage source for Hamilton, Christchurch and Wellington.
- Changed those city hubs to return `noindex, follow` while no public profile explicitly covers the city.
- Removed empty city hubs from the static sitemap and IndexNow catalogue.
- Added dynamic sitemap and IndexNow inclusion when a current public profile covers a city.
- Updated city FAQ and metadata behaviour so it does not say “no profiles” after profiles become available.

### Entity accuracy and structured data

- Replaced the generic Organization description with an evidence-led marketplace description.
- Removed the `ChildCare` LocalBusiness markup because the reviewed source did not substantiate a public physical childcare-business address or a physical childcare-centre model.
- Kept Organization, WebSite, BreadcrumbList, Article, CollectionPage and profile-specific structured data where the source visibly supports them.

### Public-copy reliability

- Replaced fabricated homepage caregiver cards with current public directory profiles.
- Replaced unverified testimonials and star ratings with a transparent shortlisting guide.
- Corrected homepage membership/location answers to match pricing and actual profile coverage.
- Softened specialist-care homepage copy so it asks families to assess the evidence shown rather than promising training, clinical outcomes or an exact match.
- Corrected shared payroll, employment-status, leave, trial, mileage, privacy, health and duties FAQ wording to avoid categorical legal claims without current source-specific review.
- Corrected membership and job-post claims that implied every nanny completed the same full verification process.

## Files changed

- `src/lib/location-coverage.ts`
- `src/components/seo/LocationNannyHub.tsx`
- `src/app/(public)/nannies/hamilton/page.tsx`
- `src/app/(public)/nannies/christchurch/page.tsx`
- `src/app/(public)/nannies/wellington/page.tsx`
- `src/app/sitemap.ts`
- `src/lib/indexnow.ts`
- `src/lib/seo.ts`
- `src/app/(public)/nannies/auckland/page.tsx`
- `src/app/(public)/page.tsx`
- `src/components/home/MarqueeTestimonials.tsx`
- `src/components/home/SpecialistExpertise.tsx`
- `src/components/home/BentoFeatures.tsx`
- `src/lib/faq.ts`
- `src/app/(public)/membership/page.tsx`
- `src/app/(public)/post-a-job/layout.tsx`
- `docs/seo/*` audit and tracking documents

## Validation performed

- Targeted ESLint run on changed files: passing after cleanup.
- TypeScript `tsc --noEmit`: passing.
- Live HTTP checks: `/robots.txt`, `/sitemap.xml` and `/find-a-nanny` returned `200`; Vercel serves the site over HTTPS.
- Live HTML check: reviewed priority pages had canonical URLs, `index, follow` where expected before this local change, visible headings and server-rendered content.
- Browser automation was attempted but did not return a usable session in this environment. Mobile visual validation remains outstanding.

## Deferred and human-review items

1. Confirm the verification-level matrix and make public copy, tiers, badges and admin enforcement consistent.
2. Decide training crawler policy for GPTBot and any equivalent training bots; do not conflate that decision with OAI-SearchBot access.
3. Verify public entity facts: legal name/NZBN, contact details, social profiles and any genuine business address.
4. Verify all specialist service claims and the childcare-support eligibility page against authoritative sources and actual operational capability.
5. Review generic suburb indexability threshold using real profile supply and query data.
6. Add reliable static-page modification dates or omit dynamic `lastmod` values.
7. Run Search Console URL Inspection, Rich Results Test, mobile checks and WAF/log inspection after release.

## Deployment

No deployment was performed. Publishing requires explicit approval after final review.
