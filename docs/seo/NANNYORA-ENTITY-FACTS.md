# NannyOra Entity Facts

Last reviewed: 13 October 2026

This is an internal source-of-truth worksheet. A fact is not public claim-ready unless its status is **Verified in repository** or **Owner-confirmed**.

| Field | Current fact | Status / source |
| --- | --- | --- |
| Brand | NannyOra | Verified in source metadata and public layout |
| Canonical website | `https://www.nannyora.co.nz` | Verified in `metadataBase`, sitemap and canonical builders |
| Business model | Online nanny-profile discovery and family matching marketplace | Verified in public page and data flow; not a claim that NannyOra employs nannies |
| Main service | Families can browse public nanny profiles, compare displayed profile information and use membership features | Verified in `/find-a-nanny`, `/pricing`, `/membership` |
| Current public profile coverage | Greater Auckland | Verified by live directory claims and current public sitemap at audit time |
| City planning guides | Hamilton, Christchurch and Wellington | Verified routes; not evidence of local public inventory |
| Verification levels | Listed Nanny, Verified Nanny, Premium Vetted Nanny, Specialist Care Nanny | Verified in `src/lib/constants/index.ts` |
| Public profile states | Approved, Verified and Specialist admin statuses can appear in the directory | Verified in `src/lib/data/nannies.ts` |
| Seven operational evidence areas | Identity, work history, professional registration, referee checks, Police vet, interview, risk assessment | Verified in `SAFETY_CHECKS`; exact completion criteria still need owner confirmation |
| Parent pricing | Browsing public profiles is free; membership unlocks additional profile/contact/booking features | Verified in `/pricing` and membership code |
| Nanny pricing | Nanny application has a free option and optional one-off listed/premium tiers; completed bookings have a service fee | Verified in `/pricing` and `src/lib/tiers.ts` |
| Legal entity | “Emli&co limited trading as NannyOra” and NZBN `9429053600813` were supplied by the owner | Owner-supplied; confirm against the official NZBN register before using in schema or public legal/entity claims |
| Public address | Not identified | Do not add LocalBusiness address markup |
| Public contact details | Not identified in reviewed source | Owner input required |
| Official social profiles | Not identified in reviewed source | Owner input required |
| Reviews/testimonials | No verified public review source identified | Do not publish ratings, testimonials or aggregate-rating schema without consented evidence |

## Claim rules

- A **Listed** profile must not be described as Police vetted, fully vetted or credential-verified by default.
- A credential should only be described as verified where the individual profile’s completed evidence supports it.
- Specialist-care copy must describe relevant experience, not diagnose, treat or promise clinical/educational outcomes.
- NannyOra connects families and caregivers; do not describe it as the employer or as a physical childcare centre unless the operational model changes and is documented.

## Unresolved verification-matrix questions

1. What exact minimum evidence changes a profile from Listed to Verified?
2. Does a Listed tier include any completed vetting before it becomes public, and if so, which checks?
3. Are Premium Vetted and Specialist Care labels assigned only when each required safety status is `VERIFIED`?
4. What makes a specialist credential eligible for the Specialist Care label?
5. Who reviews documents, and what is the re-check/expiry policy for Police vet, First Aid and registration evidence?
6. Which claims may be made about matching support, availability and city coverage?

Until these are owner-confirmed, keep public copy profile-specific and evidence-led.
