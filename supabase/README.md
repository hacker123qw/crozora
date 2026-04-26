**Supabase Auth Email Setup**

This project uses Supabase Auth for login, signup, verification, password recovery, and resend flows.

For production email delivery with Resend:
- SMTP host: `smtp.resend.com`
- SMTP port: `465`
- SMTP username: `resend`
- sender email: `support@crozora.com`
- sender name: `Crozora Support`

This repo includes:
- branded email templates in [supabase-email-templates](C:\Users\opena\Downloads\crozora-trust-seal\supabase-email-templates)
- a setup script in [scripts/configure-supabase-auth-email.mjs](C:\Users\opena\Downloads\crozora-trust-seal\scripts\configure-supabase-auth-email.mjs)

**What The Script Configures**

- enables external email delivery in Supabase Auth
- configures Resend SMTP
- sets the sender to `support@crozora.com`
- uploads the confirmation, recovery, and magic-link templates
- sets production-ready email subjects

**Local Setup**

Create a local ignored file named `.env.supabase-email.local` with:

```env
RESEND_API_KEY=your_resend_api_key
SUPABASE_ACCESS_TOKEN=your_supabase_management_token
SUPABASE_PROJECT_REF=your_project_ref
SUPABASE_SMTP_SENDER_EMAIL=support@crozora.com
SUPABASE_SMTP_SENDER_NAME=Crozora Support
```

`SUPABASE_PROJECT_REF` can be omitted if `.env.local` already contains `VITE_SUPABASE_URL`.

**Run It**

```powershell
npm run auth:email:dry-run
npm run auth:email:configure
```

**What Still Must Be Checked In Supabase**

- Authentication -> URL Configuration:
  Set your production Site URL and allowed redirect URLs.
- Authentication -> Email:
  Confirm email provider settings are present after the script runs.
- Authentication -> Rate Limits:
  Increase email rate limits for production if needed.

**Resend Requirements**

- verify the `crozora.com` domain in Resend
- confirm `support@crozora.com` is an allowed sender identity
- disable link tracking for auth emails if you see confirmation links being rewritten

**Edge Functions**

Phase 4 and Phase 6 add Supabase Edge Functions in:
- [supabase/functions/free-preview-scan/index.ts](C:\Users\opena\Downloads\crozora-trust-seal\supabase\functions\free-preview-scan\index.ts)
- [supabase/functions/public-verify/index.ts](C:\Users\opena\Downloads\crozora-trust-seal\supabase\functions\public-verify\index.ts)
- [supabase/functions/badge-svg/index.ts](C:\Users\opena\Downloads\crozora-trust-seal\supabase\functions\badge-svg\index.ts)
- [supabase/functions/recheck-followup/index.ts](C:\Users\opena\Downloads\crozora-trust-seal\supabase\functions\recheck-followup\index.ts)

`free-preview-scan`:
- fetches the submitted website server-side
- checks basic reachability and HTTPS
- looks for contact, privacy, terms, about, and pricing signals
- resolves the authenticated user's website ownership and paid entitlement server-side before any paid run
- treats both one-time verification and Pro as advanced report depth
- stores a practical free preview summary through the existing frontend save flow

`public-verify`:
- returns only customer-safe badge and verification information
- keeps private reports, scores, and internal notes out of the public response

`badge-svg`:
- returns a live SVG badge image for the current public slug
- is intended as the image fallback for badge installs

`recheck-followup`:
- runs a paid follow-up scan for one-time or Pro users
- compares the new findings against the previous scan
- revalidates the website entitlement on the server before running
- returns a business-friendly AI follow-up message plus improved/still-missing items

**AI Report Configuration**

Phase 7 adds optional AI report augmentation inside [supabase/functions/_shared/ai-report.ts](C:\Users\opena\Downloads\crozora-trust-seal\supabase\functions\_shared\ai-report.ts).

To enable it for the scan function, set these Supabase function secrets:

```powershell
npx supabase secrets set AI_API_KEY=your_key_here
npx supabase secrets set AI_MODEL=your_model_here
npx supabase secrets set AI_BASE_URL=https://api.groq.com/openai/v1
```

Notes:
- `AI_API_KEY` must stay server-side only
- `AI_MODEL` is required for live AI calls
- if these secrets are missing, the scan function safely falls back to rule-based reports only

Optional model routing secrets for later phases:

```powershell
npx supabase secrets set AI_MODEL_FAST=groq/compound-mini
npx supabase secrets set AI_MODEL_GUARD=meta-llama/llama-prompt-guard-2-86m
```

Suggested current setup:
- `AI_MODEL=llama-3.3-70b-versatile`
- `AI_MODEL_FAST=groq/compound-mini`
- `AI_MODEL_GUARD=meta-llama/llama-prompt-guard-2-86m`

Deploy them with the Supabase CLI:

```powershell
npx supabase functions deploy free-preview-scan
npx supabase functions deploy public-verify
npx supabase functions deploy badge-svg
npx supabase functions deploy recheck-followup
```

For local function development:

```powershell
npx supabase functions serve free-preview-scan
npx supabase functions serve public-verify
npx supabase functions serve badge-svg
npx supabase functions serve recheck-followup
```
