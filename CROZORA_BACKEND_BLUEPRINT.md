MASTER CROZORA BACKEND BUILD BRIEF FOR CODEX

IMPLEMENTATION AUDIT - APRIL 25, 2026

This section tracks what is actually present in the codebase right now.

Phase 1: Supabase schema and RLS
- Implemented in code:
  - `supabase/schema.sql` exists
  - core tables are defined for `profiles`, `businesses`, `websites`, `domain_verifications`, `trust_scans`, `site_reports`, `badges`, and `billing_entitlements`
  - RLS policies and profile trigger are present in the SQL file
- Verified in this session:
  - the SQL file content exists in the repo
  - app code builds against the current schema assumptions
  - the linked Supabase database received a tracked baseline schema migration in this session
- Remaining note:
  - the schema is now migration-backed, but a full end-to-end system run is still needed to confirm every table is behaving correctly in the app

Phase 2: Connect users to their data
- Implemented in code:
  - onboarding creates real `businesses`, `websites`, and `domain_verifications` rows
  - dashboard reads real website/report/verification/badge/entitlement data from Supabase
  - Pro website list now uses real owned website rows, not hardcoded example rows
- Verified in this session:
  - the data-loading code exists
  - the frontend builds successfully
- Not fully verified from the repo alone:
  - full end-to-end live data correctness for every dashboard section without a final manual system run

Phase 3: DNS TXT verification
- Implemented in code:
  - unique DNS TXT verification records are generated and stored
  - live DNS TXT lookup is performed through public DNS-over-HTTPS resolvers
  - onboarding and dashboard ownership flows use the live lookup result
- Verified in this session:
  - DNS verification code exists
  - the frontend builds successfully
- Not fully verified from the repo alone:
  - live DNS propagation behavior across real user domains without a fresh end-to-end run

Phase 4: Free trust preview scan
- Implemented in code:
  - onboarding creates stored `trust_scans` and `site_reports`
  - Supabase Edge Function `free-preview-scan` performs a server-side website fetch and practical V1 checks
  - frontend falls back safely if the function is unavailable
- Verified in this session:
  - the function source exists in `supabase/functions/free-preview-scan/index.ts`
  - the frontend builds successfully
- Deployment note:
  - the function was deployed previously, but the latest Phase 5 changes modify that same function, so it must be redeployed again

Phase 5: Paid report logic
- Implemented in code:
  - entitlement lookup now supports owner-wide and website-specific active entitlements
  - paid scan and recheck functions now resolve website ownership and entitlements server-side instead of trusting browser-provided plan levels
  - report access now derives from real entitlements instead of mock UI assumptions
  - paid report generation is wired to the server-side scan function with backend entitlement checks before paid runs
  - one-time and Pro both use the advanced report depth
  - paid report generation creates real `trust_scans` and `site_reports` records
  - website verification/badge readiness state is updated from the paid report result
- Verified in this session:
  - the new Phase 5 frontend code builds successfully
  - `free-preview-scan` was redeployed after the entitlement hardening changes
  - the linked Supabase database received the hardening migration that enforces `advanced_paid` scan types and removes legacy `basic` report levels
- Not fully verified from the repo alone:
  - real entitlement rows in `billing_entitlements` are still required for true one-time/pro behavior
  - a full authenticated end-to-end paid scan has still not been run in this session

Phase 6: Badge and public trust page
- Implemented in code:
  - approved paid reports now create or reactivate real `badges` rows
  - approved websites now move to `badge_status = active` and `public_page_status = active`
  - badge setup UI now uses real badge records, real public slugs, and real install code
  - public verification page no longer uses demo state switching and now loads live data through a public-safe edge function
  - a live SVG badge fallback function and a static `public/badge.js` installer script now exist in the repo
- Verified in this session:
  - the Phase 6 code is present in the repo
  - `public-verify` and `badge-svg` were deployed to the linked Supabase project in this session
- Not fully verified from the repo alone:
  - a full end-to-end live badge installation test has not been run yet in this session

Phase 7: AI report generation
- Implemented in code:
  - a shared AI wrapper now exists at `supabase/functions/_shared/ai-report.ts`
  - `free-preview-scan` now attempts AI report augmentation using `AI_API_KEY`, `AI_MODEL`, and `AI_BASE_URL`
  - if AI secrets are missing or the provider call fails, the function safely falls back to the existing rule-based report generation
- Verified in this session:
  - the new Phase 7 code is present in the repo
  - Groq-related Supabase function secrets were set in the linked Supabase project
  - `free-preview-scan` was redeployed after the Phase 7 AI changes
  - the frontend build still passes after the Phase 7 changes
- Not fully verified from the repo alone:
  - a full authenticated end-to-end AI report run has not been completed yet in this session
  - a direct anonymous REST smoke test returned `401 Unauthorized`, so live confirmation should come from the app's authenticated scan flow

Phase 8: Rechecks and AI follow-up
- Implemented in code:
  - schema now includes `recheck_requests` and `ai_report_messages`
  - dashboard Rechecks UI now stores user follow-up messages and recheck request records
  - a new `recheck-followup` edge function now runs a fresh paid scan, compares old vs new findings, and returns an AI follow-up summary
  - successful rechecks now create a new `trust_scans` row, a new `site_reports` row, and update website/badge/public-page state
- Verified in this session:
  - the new Phase 8 code is present in the repo
  - the linked Supabase database received the Phase 8 recheck tables through migrations in this session
  - the new `recheck-followup` function was deployed to the linked Supabase project in this session
  - `recheck-followup` was redeployed after the new server-side entitlement enforcement changes
- Not fully verified from the repo alone:
  - a full authenticated end-to-end recheck flow has not been run yet in this session

You are working inside the Crozora codebase.

Crozora is a trust verification SaaS for websites and local/service businesses.

The core product is:

A business submits a website.
Crozora verifies that the user owns the website.
Crozora scans the website and visible trust signals.
Crozora gives a limited free preview.
If the user pays, Crozora gives deeper reports and badge access if approved.
Approved websites can display a live Crozora Verified Badge.
That badge links to a public Crozora verification page.
Customers can click the badge to confirm the business is actually verified.

Crozora must never claim that a business is “100% safe,” “scam-free,” or “guaranteed trustworthy.”

Crozora should say:

- passed Crozora’s verification checks
- verified website ownership
- public trust page active
- last checked date
- no major visible scam-risk signals detected
- business trust signals reviewed

The product is about transparent verification, not magical guarantees.

IMPORTANT CURRENT STACK

Current frontend:
- Vite + React
- Tailwind
- React Router
- Supabase Auth already migrated
- Base44 auth/runtime removed
- Dashboard/UI is currently mostly prototype/demo state

Backend/database target:
- Supabase Postgres
- Supabase Auth
- Supabase Storage if needed later
- Hetzner hosts the app
- Cloudflare handles DNS/proxy
- AI report generation should use Grok/Groq-style API through environment variables, never hardcoded

IMPORTANT SECURITY RULE

Do not hardcode API keys.
Do not commit secrets.
Use environment variables only.

Expected env vars may include:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_API_KEY
AI_MODEL
AI_BASE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
SITE_URL

Frontend Vite env vars can use VITE_ prefix.
Server-only secrets must not use VITE_.

CROZORA PRICING MODEL

Crozora has 3 levels.

1. Free Trust Preview — $0

Free users can submit a website and run a limited preview.

Free includes:
- website submission
- DNS ownership verification
- limited trust preview
- simple result only

Free result wording should be limited to:
- Looks promising
- Needs improvement
- Needs closer review

Free does NOT include:
- badge
- public trust page
- detailed report
- exact score
- advanced recommendations
- full scan findings
- technical fixes
- ongoing monitoring

Free should create interest without giving away the paid report.

2. One-Time Site Verification — $30 per website

This applies to one specific website only.

Example:
If a user pays $30 for tuneteachers.com, that payment only covers tuneteachers.com.

If they want to verify another website, they must pay another $30 for that specific website.

This tier includes:
- badge access for that specific website if approved
- public trust page for that specific website if approved
- advanced site report for that specific website
- advanced explanation of why the site passed or did not pass
- advanced improvement suggestions
- advanced recheck guidance for that specific website

This tier does NOT include:
- multiple website coverage
- advanced technical recommendations
- ongoing monitoring across multiple websites
- full Pro dashboard access
- multi-site comparison
- advanced AI follow-up

3. Crozora Pro — $20/month

This is the full platform plan.

Pro includes:
- multiple websites under one account, subject to reasonable fair-use limits
- badge access for approved websites
- public trust pages for approved websites
- advanced reports
- deeper technical recommendations
- specific implementation guidance
- ongoing monitoring/rechecks
- badge status monitoring
- badge install support
- AI follow-up per website
- multi-site dashboard

Important:
Payment never guarantees badge approval.
A website must pass verification before receiving an active badge.

CORE USER FLOW

1. User signs up or logs in.
2. User adds a website.
3. User verifies ownership using DNS TXT.
4. User runs a free trust preview.
5. Free result shows only limited status.
6. User can pay $30 for one specific website or start $20/month Pro.
7. Backend runs deeper scan/report depending on plan.
8. If site passes, badge becomes available.
9. User installs badge on their website.
10. Badge links to public Crozora verification page.
11. Public page shows customer-facing verification proof only.
12. Private report shows business-facing details.

WEBSITE OWNERSHIP VERIFICATION

Crozora should use DNS TXT verification like Google Search Console.

Backend flow:

1. User adds website URL.
2. Normalize URL into domain.

Examples:
- https://www.example.com/path → example.com
- http://example.com → example.com
- www.example.com → example.com
- example.com → example.com

3. Generate a unique verification token.

Example:
crozora_verify_7K92XQ_RANDOMTOKEN

4. Store verification record in database:
- website_id
- token
- dns_name
- expected_value
- status: pending / verified / failed / expired
- created_at
- verified_at

5. Show DNS instructions to user:

Type: TXT
Name: _crozora.example.com
Value: crozora_verify_xxxxx

6. Backend check function queries DNS TXT records for:
_crozora.example.com

7. If expected value exists, mark website ownership verified.

8. If not found, keep pending and return user-friendly message:
“DNS records can take a few minutes to several hours to appear.”

Do not require paid plan for ownership verification.
Ownership verification is part of free onboarding.

DATABASE MODEL

Create Supabase tables carefully with Row Level Security.

Recommended tables:

profiles
- id uuid primary key references auth.users
- email text
- full_name text
- role text default 'user'
- created_at timestamp
- updated_at timestamp

businesses
- id uuid primary key
- owner_id uuid references auth.users
- business_name text
- business_email text
- category text
- service_type text: online / in_person / both
- country text
- state_region text
- city text
- created_at timestamp
- updated_at timestamp

websites
- id uuid primary key
- business_id uuid references businesses
- owner_id uuid references auth.users
- raw_url text
- normalized_domain text
- website_url text
- website_builder text
- contact_page_url text
- privacy_policy_url text
- terms_policy_url text
- review_profile_url text
- ownership_status text: not_started / pending / verified / failed
- preview_status text: not_started / running / complete / failed
- verification_status text: not_started / pending / approved / not_approved / suspended / revoked
- badge_status text: unavailable / approved / active / expired / suspended / revoked
- public_page_status text: inactive / active
- plan_coverage text: free / one_time / pro
- last_checked_at timestamp
- next_recheck_at timestamp
- created_at timestamp
- updated_at timestamp

domain_verifications
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- dns_name text
- token text
- expected_value text
- status text: pending / verified / failed / expired
- attempts integer
- last_checked_at timestamp
- verified_at timestamp
- created_at timestamp

trust_scans
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- scan_type text: free_preview / advanced_paid / pro_advanced / recheck
- status text: queued / running / completed / failed
- overall_status text: looks_promising / needs_improvement / needs_closer_review / approved / not_approved
- score integer nullable
- raw_scan_data jsonb
- findings jsonb
- created_at timestamp
- completed_at timestamp

site_reports
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- report_level text: free / advanced
- title text
- summary text
- score integer nullable
- status text
- sections jsonb
- recommendations jsonb
- ai_summary text
- created_at timestamp
- updated_at timestamp

badges
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- badge_token text unique
- status text: inactive / active / expired / suspended / revoked
- public_slug text unique
- issued_at timestamp
- expires_at timestamp
- last_checked_at timestamp
- created_at timestamp
- updated_at timestamp

badge_events
- id uuid primary key
- badge_id uuid references badges
- website_id uuid references websites
- event_type text: view / click / render
- referrer text
- user_agent text
- ip_hash text
- created_at timestamp

recheck_requests
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- message text
- status text: requested / queued / running / complete / rejected
- created_at timestamp
- completed_at timestamp

ai_report_messages
- id uuid primary key
- website_id uuid references websites
- owner_id uuid references auth.users
- role text: user / assistant / system
- content text
- created_at timestamp

billing_entitlements
- id uuid primary key
- owner_id uuid references auth.users
- website_id uuid nullable references websites
- entitlement_type text: free / one_time_site / pro
- status text: active / inactive / expired / canceled
- stripe_customer_id text nullable
- stripe_subscription_id text nullable
- stripe_payment_id text nullable
- starts_at timestamp
- ends_at timestamp
- created_at timestamp
- updated_at timestamp

admin_reviews
- id uuid primary key
- website_id uuid references websites
- reviewer_id uuid nullable references auth.users
- status text: pending / approved / not_approved / needs_changes
- notes text
- created_at timestamp
- updated_at timestamp

reported_issues
- id uuid primary key
- website_id uuid references websites
- badge_id uuid nullable references badges
- reporter_email text nullable
- reason text
- details text
- status text: open / reviewing / resolved / dismissed
- created_at timestamp
- updated_at timestamp

ROW LEVEL SECURITY

Use strict RLS.

Rules:
- Users can read/update their own profile.
- Users can CRUD businesses they own.
- Users can CRUD websites they own.
- Users can read scans/reports for websites they own.
- Users can read badges for websites they own.
- Public users can read only public verification page data for active badges.
- Public users should not see private reports, scores, failed checks, or recommendations.
- Admin-only tables/actions should require role = admin.

PUBLIC VERIFICATION PAGE

Public URL example:
https://crozora.com/verify/tuneteachers

Public page should show only customer-facing proof.

Show:
- business/website name
- domain
- Crozora Verified status
- Active / Expired / Suspended / Not found status
- last checked date
- checks shown to customers:
  - website ownership confirmed
  - HTTPS detected
  - business contact signals reviewed
  - public business policies found
  - no major visible scam-risk signals detected
  - badge authenticity confirmed

Do NOT show publicly:
- exact private score
- failed checks
- internal scan notes
- improvement recommendations
- AI conversation
- sensitive business info
- private report sections

Disclaimer on public page:
“Crozora verification means this website passed Crozora’s checks at the time shown. It does not guarantee every customer experience or remove all risk.”

BADGE SYSTEM

Badge must not be just a downloadable image.

Backend should support a live badge script and image fallback.

Script badge example:
<script src="https://crozora.com/badge.js" data-business-id="BADGE_TOKEN"></script>

Image fallback:
<a href="https://crozora.com/verify/public-slug" target="_blank">
  <img src="https://crozora.com/badge/public-slug.svg" alt="Crozora Verified Badge">
</a>

Backend endpoints needed eventually:
GET /badge.js
GET /badge/:slug.svg
GET /verify/:slug
POST /api/badge-event

Badge behavior:
- if active: show Crozora Verified
- if expired: show Verification Expired or hide depending design
- if suspended/revoked: do not show active verified badge
- if invalid token: return safe fallback or not found

The badge should always link to Crozora public verification page.

FAILED WEBSITES

Important:
Never create a public “bad site” badge.
Never publicly shame failed businesses.

If a website does not pass:
- private dashboard shows not approved
- private report shows what to improve if paid
- no public badge
- no public negative page

SITE SCANNING LOGIC

The backend should eventually crawl and analyze the website.

Start with a practical V1 scan engine.

Inputs:
- website URL/domain
- business name
- business email
- category
- service area
- optional URLs: contact page, privacy policy, terms/policy, review profile

V1 scan checks:

Technical/website basics:
- site reachable
- HTTPS enabled
- redirects resolve correctly
- homepage loads successfully
- basic page title/meta description exists
- no obvious broken homepage response
- no obvious parked domain indicators

Ownership/security:
- DNS TXT ownership verified
- domain consistency
- HTTPS present

Trust content:
- contact page exists
- business email visible or provided
- phone/address/service area visible if relevant
- privacy policy exists
- terms/refund/cancellation policy exists where relevant
- about page exists
- service description is clear
- pricing or quote process is explained
- customer support/contact method is clear

Reputation signals:
- review profile URL provided or detected
- social links found
- external reputation signals placeholder for future
- suspicious review analysis later

Scam-risk indicators:
- unrealistic claims
- missing contact info
- no policies
- mismatched business name/domain
- vague service description
- suspicious urgency language
- fake-looking badges/seals
- broken pages
- no identifiable operator

AI analysis:
Use AI to interpret findings into human-friendly report sections.
AI should not be the only judge.
Rule-based scan data should feed AI.
AI summarizes, explains, and recommends.

REPORT LEVELS

Free report:
Very shallow.
No exact score.
No detailed reasons.

Example:
Title: “Your website shows early trust signals”
Body:
“Crozora found some visible trust signals, but detailed findings are available with a paid verification option.”

Possible statuses:
- Looks promising
- Needs improvement
- Needs closer review

One-Time $30 advanced report:
For one website only.
Should be detailed enough to be useful.

Include:
- overall summary
- advanced pass/fail areas
- why the site passed or did not pass
- advanced missing trust signals
- advanced improvement suggestions
- page-specific notes when available
- practical example wording and implementation guidance

Example recommendation:
“Add a clear cancellation or refund policy. A simple policy section can reduce customer hesitation. Example: ‘Customers may cancel up to 24 hours before a scheduled appointment without penalty.’”

Pro $20/month advanced report:
For multiple websites.
More detailed and technical.

Include:
- advanced score breakdown
- page-by-page findings
- exact page URLs affected
- prioritized fixes
- technical implementation guidance
- example content blocks
- AI follow-up
- recheck history
- multi-site management
- ongoing monitoring

Report sections should be separated by website.
Never mix findings from multiple websites.

Suggested report structure JSON:

sections: [
  {
    "id": "summary",
    "title": "Trust Summary",
    "visibility": "private",
    "content": "...",
    "severity": "info"
  },
  {
    "id": "ownership",
    "title": "Website Ownership",
    "status": "passed",
    "findings": []
  },
  {
    "id": "contact",
    "title": "Contact & Business Clarity",
    "status": "needs_improvement",
    "findings": [
      {
        "page": "https://example.com/contact",
        "issue": "No business email is visible on the contact page.",
        "why_it_matters": "Customers may hesitate if they cannot identify a reliable contact method.",
        "suggested_fix": "Add a business email or contact form with expected response time.",
        "example": "Email us at support@example.com. We usually respond within 1 business day."
      }
    ]
  }
]

AI FOLLOW-UP

For paid users, especially Pro, add interactive AI follow-up per website.

User can say:
“I added a refund policy and updated the contact page.”

Backend should:
1. Save message.
2. Trigger or queue a recheck.
3. Rescan relevant pages.
4. Compare old findings vs new findings.
5. Respond with:
   - what improved
   - what is still missing
   - whether verification status changed
   - next recommended action

Do not let AI invent scan results.
AI must use stored scan data and crawl results.

GROK/GROQ AI INTEGRATION

The AI provider should be configurable.

Use environment variables:
AI_API_KEY
AI_BASE_URL
AI_MODEL

If using Grok/xAI, base URL may be different.
If using Groq OpenAI-compatible API, base URL may be:
https://api.groq.com/openai/v1

Do not hardcode provider-specific logic too deeply.
Create an AI service wrapper like:

src/server/ai/analyzeReport.js
or
src/lib/server/aiClient.js

Expected AI tasks:
- summarize scan findings
- generate business-friendly explanations
- generate improvement suggestions
- create example wording/content
- classify severity
- produce plan-specific report depth

AI must receive structured scan facts and return structured JSON if possible.

AI prompt must include:
- plan level: free/advanced
- website domain
- scan facts
- detected pages
- trust signals
- missing items
- risk indicators
- required output format

Do not expose raw AI key to frontend.

BACKEND API / FUNCTION DESIGN

Since current app is Vite frontend, backend options:

Option A:
Use Supabase Edge Functions for backend logic.

Option B:
Create separate Node/Express backend on Hetzner.

Option C:
Use serverless/API routes if framework changes later.

For now, implement backend logic cleanly so it can run either as Supabase Edge Functions or Node backend.

Recommended API/function names:

POST /api/websites
- create website/business record
- normalize domain
- generate ownership verification record

POST /api/websites/:id/check-ownership
- DNS TXT lookup
- update ownership status

POST /api/websites/:id/run-preview
- run free trust preview
- create trust_scan record
- create limited site_report record

POST /api/websites/:id/run-paid-scan
- check entitlement
- run entitlement-checked paid scan depending plan

POST /api/websites/:id/request-recheck
- queue recheck

GET /api/websites
- list current user’s websites

GET /api/websites/:id/report
- return report based on entitlement

GET /api/verify/:slug
- public verification data

GET /badge/:slug.svg
- live badge SVG

GET /badge.js
- render script badge

POST /api/badge-event
- track view/click/render

ADMIN FUNCTIONALITY

Admin dashboard should eventually allow:
- view all websites
- review pending scans
- approve/not approve/suspend/revoke badge
- view scan logs
- view reports/complaints
- manually trigger recheck
- manage reported issues

Admin actions must be protected by role.

APP STATE LOGIC

Website statuses should be explicit.

ownership_status:
- not_started
- pending
- verified
- failed

preview_status:
- not_started
- running
- complete
- failed

plan_coverage:
- free
- one_time
- pro

verification_status:
- not_started
- pending
- approved
- not_approved
- suspended
- revoked

badge_status:
- unavailable
- approved
- active
- expired
- suspended
- revoked

public_page_status:
- inactive
- active

DASHBOARD LOGIC

Free dashboard:
- show ownership verified
- preview complete
- report limited/locked
- badge unavailable
- public trust page unavailable
- CTAs:
  - Verify this website — $30
  - Start Crozora Pro — $20/month

One-Time dashboard:
- show covered website only
- advanced report
- badge status for that website
- public trust page if approved
- warning:
  “This one-time verification applies only to this website.”

Pro dashboard:
- multiple websites
- advanced reports
- ongoing monitoring
- add another website
- recheck queue
- badge management
- advanced recommendations

Not approved dashboard:
- private improvement guidance only
- no public negative badge
- CTA: Request recheck

EMAIL / AUTH

Auth already uses Supabase.
Use Resend for production email sender.

Sender:
support@crozora.com

Email templates should be branded and professional:
- confirm signup
- reset password
- magic link if used

Do not hardcode Resend API key.
SMTP setup should happen in Supabase Auth settings.

PAYMENTS

Payments are last.
Do not implement Stripe yet unless explicitly asked.

But database should be designed so Stripe can be added later.

Billing rules:
- Free: no badge, limited preview
- $30 one-time: one website only, badge if approved, advanced report
- $20/month Pro: multiple websites, advanced reports, badges for approved websites

IMPLEMENTATION PRIORITY

Do not build everything at once.

Recommended backend build order:

Phase 1: Supabase schema and RLS
- profiles
- businesses
- websites
- domain_verifications
- trust_scans
- site_reports
- badges
- billing_entitlements

Phase 2: Connect users to their data
- user creates business
- user creates website
- dashboard reads real websites
- remove sessionStorage demo state where appropriate

Phase 3: DNS TXT verification
- generate token
- show DNS record
- check DNS
- update ownership status

DNS ownership verification should use real DNS lookup, not a fake placeholder flow.
The user experience must be plain-language and easy for non-technical people to complete, including elderly users and first-time entrepreneurs.
Instructions should avoid jargon where possible, explain what to copy and where to paste it, and clearly reassure the user that DNS changes can take time.

Phase 4: Free trust preview scan
- simple crawler/fetcher
- basic checks
- limited result

Phase 5: Paid report logic
- one-time advanced report
- pro advanced report
- entitlement-based visibility

Phase 6: Badge and public trust page
- active badge records
- public verify page
- badge SVG/script

Phase 7: AI report generation
- structured scan facts
- AI summaries/recommendations
- plan-based detail levels

Phase 8: Rechecks and AI follow-up
- user says what changed
- recheck
- updated report

Phase 9: Payments
- Stripe
- webhooks
- entitlement updates

WHAT TO DO NOW

Do not start payments yet.
Do not overbuild admin yet.
Do not rewrite the whole UI.
Start by implementing the database schema, RLS, and real user-owned data flow.

First coding task should be:

1. Create Supabase SQL schema file in the repo:
supabase/schema.sql

2. Create app-side service files for:
src/services/websites.js
src/services/businesses.js
src/services/reports.js
src/services/domainVerification.js

3. Update onboarding so submitted website/business data saves to Supabase instead of only sessionStorage.

4. Keep UI behavior mostly the same, but data should persist by logged-in user.

5. Do not implement real DNS lookup yet in this first step unless asked. Prepare the database and UI flow so DNS verification can be added next.

QUALITY REQUIREMENTS

- Keep code organized.
- Do not hardcode secrets.
- Do not break existing UI.
- Keep app building.
- Make small, testable steps.
- Report every changed file.
- Tell user exactly what commands to run.
- Do not implement payment until later.

Note:
The live Groq API key shared in chat was intentionally not written into this file. Store it in a local environment variable such as AI_API_KEY instead of source control.
