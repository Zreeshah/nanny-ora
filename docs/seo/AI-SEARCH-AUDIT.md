# NannyOra AI Search Readiness Audit

Date: 13 October 2026

## Scope and evidence

This audit reviewed the public Next.js routes, metadata, `robots.ts`, `sitemap.ts`, IndexNow catalogue, JSON-LD builders, public directory data flow, verification constants and the live public responses for `/robots.txt`, `/sitemap.xml`, `/find-a-nanny`, `/nanny-vetting` and `/nannies/hamilton`.

Google Search Console, GA4, CDN/WAF configuration and server logs were not available. Findings that need those systems are marked as unverified.

Official guidance used: [Google robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), and [Perplexity crawler guidance](https://docs.perplexity.ai/guides/bots).

## Executive summary

NannyOra has a sound base for AI-assisted discovery: public pages are server-rendered, canonical URLs are present on reviewed pages, the sitemap is reachable, and private application areas are blocked from general crawling. The strongest content is the nanny hiring, vetting, safety, cost and payroll cluster.

The key risks were credibility and index quality rather than missing “GEO” markup. Local pages without local profiles were still being promoted, and the homepage included placeholder profiles and testimonials that could be mistaken for real people or customer evidence. These issues have been corrected locally and require a normal release to reach production.

## Critical

### Placeholder caregivers and testimonials presented as real evidence — fixed locally

- **Evidence:** The homepage held hard-coded caregiver names, rates, backgrounds and profile imagery, plus five named customer testimonials. These were not sourced from the public database or a verified review system.
- **Risk:** False entity, experience and review signals undermine parent trust and make the site an unreliable citation source.
- **Fix applied:** The homepage now renders only approved public directory profiles and replaces the testimonial module with a transparent nanny-shortlisting guide.
- **Validation:** Requires production release and visual review after deployment.

### Empty city hubs promoted as indexable — fixed locally

- **Evidence:** The live Hamilton page reported no local public profiles but returned `index, follow` and appeared in the sitemap. The same static sitemap/IndexNow path applied to Christchurch and Wellington.
- **Risk:** Thin local landing pages can be interpreted as low-value or misleading location inventory pages.
- **Fix applied:** Hamilton, Christchurch and Wellington now return `noindex, follow` while no profile explicitly covers the city. They automatically become indexable and enter the sitemap and IndexNow set when a public local profile appears.
- **Validation:** Requires production release. The pages remain available to families.

## High

### Verification terminology is not fully consistent — human review required

- **Evidence:** `VERIFICATION_LEVELS`, `NANNY_TIERS`, the membership page and Trust & Safety page make overlapping but non-identical statements. For example, Listed profiles are described as not necessarily having admin-verified documents, while the standard tier says it “covers vetting”; membership previously stated that every nanny completes the full compliance process.
- **Risk:** A citation or parent may infer every profile has the same checks. This is especially material for child safety.
- **Action:** Confirm the operational definition and minimum completed evidence for Listed, Verified, Premium Vetted and Specialist Care. Then make the public copy, badges, tier sales page and admin enforcement rules use one exact matrix. Do not publish broader claims until approved.

### Training-crawler policy is not separated from search-crawler policy — human decision required

- **Evidence:** `robots.txt` currently has one permissive `User-agent: *` rule. This allows OAI-SearchBot and PerplexityBot to access intended public pages, but also does not separately express a GPTBot/training preference.
- **Risk:** The current behaviour may not match NannyOra’s business preference for model training.
- **Action:** Obtain an owner decision for GPTBot and other training-oriented bots. Do not make a global crawler-policy change without that decision. OAI-SearchBot is already allowed, which aligns with OpenAI’s search-discovery documentation; Google confirms that Googlebot controls Search/AI Overview eligibility, while Google-Extended is a separate Gemini training/grounding control.

### Legacy specialist landing pages need claim-by-claim verification

- **Evidence:** `/ece-nanny-auckland`, `/neurodiverse-childcare-auckland`, `/sensory-aware-nanny-auckland` and `/specialist-childcare-auckland` use broad service descriptions. Some text could be read as guaranteeing qualifications, credentials or a defined specialist service.
- **Risk:** Medical, safeguarding and qualification claims need a precise source and visible evidence.
- **Action:** Retain pages, but review claims against actual profile fields and completed verification records before further promotion. Use “profiles that list…” language where evidence is self-reported or incomplete.

## Medium

### Local suburb threshold is permissive

- **Evidence:** A generic Auckland suburb route becomes indexable when a single current profile matches a suburb or travel area.
- **Risk:** One-profile pages may remain too similar to other suburb pages and create thin local inventory pages.
- **Action:** Review a sample of live suburb pages after release. Consider a higher profile/unique-information threshold only after checking real demand and user value; do not bulk-noindex routes blindly.

### Sitemap `lastmod` values are generated at request time

- **Evidence:** Static sitemap entries use the current timestamp for every response.
- **Risk:** It suggests all static pages changed when they did not, reducing the usefulness of freshness signals.
- **Action:** Track an explicit content modification date for static landing pages or omit `lastmod` when no reliable date exists.

### Some public metadata inherits a generic Auckland social description

- **Evidence:** The reviewed Hamilton HTML had page-specific title, canonical and description, but inherited a generic Auckland Twitter description.
- **Risk:** Social previews may be inaccurate for a city guide and convey an overly broad service claim.
- **Action:** Add page-specific Twitter metadata to priority city and trust pages after the operational coverage review.

### Childcare-support eligibility statements need source confirmation

- **Evidence:** `/childcare-support` makes a general eligibility statement without clear programme, criteria or authoritative citation.
- **Action:** Obtain the exact programme and eligibility basis, add primary New Zealand sources, or noindex the page until it can be substantiated.

## Low / observations

- Reviewed pages include self-referencing canonical URLs and visible server-rendered headings and content.
- `robots.txt` correctly blocks dashboard, admin, API and password-reset areas. Robots is not treated as access control; private data must remain authenticated.
- The public sitemap is reachable and contains canonical public routes plus database-backed nanny profile URLs.
- The main directory is server-rendered with its public profile set passed into the client filter, so key content is present before client filtering. Validate with Search Console URL Inspection after release.
- Breadcrumb JSON-LD is present on reviewed guides and location pages. FAQ JSON-LD is used where visible FAQ content exists; it is not a citation guarantee.
- A `ChildCare` LocalBusiness schema with only a city-level address was removed locally. The marketplace should use Organization markup until a genuine public local-business address and eligibility are verified.

## Internal-link and orphan assessment

- Core guides link naturally into `/find-a-nanny`, vetting, cost, contract and payroll pages.
- The footer gives the major foundation pages an incoming path. Auckland has contextual local links; Hamilton had one footer path and the no-profile guides should not be treated as indexable destination pages until coverage exists.
- No broken literal internal links were found in the reviewed public source files.
- The legacy specialist cluster and city hubs should receive a second relationship review after the verification matrix and actual coverage are confirmed.

## Required validation after release

1. Inspect `/find-a-nanny`, `/nannies/hamilton`, `/nannies/christchurch`, `/nannies/wellington`, `/robots.txt` and `/sitemap.xml` with Search Console URL Inspection.
2. Confirm no local city URL without profiles remains in the sitemap or IndexNow submission payload.
3. Test mobile directory filters and primary CTAs on a physical device or authenticated browser session.
4. Check platform/WAF logs for Googlebot, Bingbot, OAI-SearchBot and PerplexityBot; validate bot identity using each provider’s published guidance.
5. Resolve the verification matrix before increasing trust claims or adding further specialist pages.
