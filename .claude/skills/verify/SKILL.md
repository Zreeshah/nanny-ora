---
name: verify
description: How to verify NannyOra end-to-end (launch, drive, evidence)
---

# NannyOra verification recipe

- Launch: `npm run dev` (ready <1s, port 3000). Uses production Supabase from `.env` — treat DB as prod.
- Auth over HTTP: `GET /api/auth/csrf` → `POST /api/auth/callback/credentials` with `csrfToken,email,password` + cookie jar. Demo logins: admin@/emma@/parent@nannyora.co.nz, password `demo1234`.
- Browser flows: Playwright (install into a scratch dir, NOT this repo). Inputs have no label association — locate by `name=` or placeholder, never getByLabel. JSX splits text nodes — XPath must use `contains(., "…")` not `text()`.
- Server actions round-trip in 2–14s (Supabase us-east-1) — always poll for a data-driven condition, never fixed sleeps; dashboards render zeros until loaded.
- Test data: use `delivered+<tag>@resend.dev` emails (Resend test inbox — safe). NEVER touch real applicants in admin (status changes email real people). Clean up by deleting the audit users (cascade removes profiles/enquiries/jobs/favourites).
- Email evidence: `GET https://api.resend.com/emails` with the API key from `.env`/Vercel.
