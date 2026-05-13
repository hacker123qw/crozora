# Crozora — Claude Working Instructions

## Branching & Commits
- Never work directly on `main`.
- Use feature branches for all changes.
- Keep commits small and focused; one logical change per commit.

## Secrets & Environment Variables
- Do not print, commit, or expose secret values under any circumstances.
- Do not print the contents of `.env` files.
- Do not add `VITE_` prefixes to secret backend keys — doing so exposes them to the browser bundle.
- Supabase keys, Resend keys, AI keys, and service-role keys must remain outside committed code at all times.

## Protected Configuration (Do Not Touch Unless Explicitly Asked)
- Supabase configuration (project settings, auth config, storage rules)
- Database schema (tables, columns, RLS policies, migrations)
- Supabase Edge Functions
- Deployment configuration (Vercel, Netlify, or equivalent)
- Environment configuration files (`.env`, `.env.local`, `.env.production`, etc.)

## Workflow
- Before making code changes, inspect the relevant files first and explain the plan.
- After code changes, run available checks when relevant:
  - `npm run build`
  - `npm run lint`
  - `npm run typecheck`
- Keep changes small and reviewable — avoid large, hard-to-review diffs.
