begin;

create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  business_name text not null,
  business_email text,
  category text,
  service_type text not null default 'online' check (service_type in ('online', 'in_person', 'both')),
  country text,
  state_region text,
  city text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  raw_url text not null,
  normalized_domain text not null,
  website_url text not null,
  website_builder text,
  contact_page_url text,
  privacy_policy_url text,
  terms_policy_url text,
  review_profile_url text,
  ownership_status text not null default 'not_started' check (ownership_status in ('not_started', 'pending', 'verified', 'failed')),
  preview_status text not null default 'not_started' check (preview_status in ('not_started', 'running', 'complete', 'failed')),
  verification_status text not null default 'not_started' check (verification_status in ('not_started', 'pending', 'approved', 'not_approved', 'suspended', 'revoked')),
  badge_status text not null default 'unavailable' check (badge_status in ('unavailable', 'approved', 'active', 'expired', 'suspended', 'revoked')),
  public_page_status text not null default 'inactive' check (public_page_status in ('inactive', 'active')),
  plan_coverage text not null default 'free' check (plan_coverage in ('free', 'one_time', 'pro')),
  last_checked_at timestamptz,
  next_recheck_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.domain_verifications (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  dns_name text not null,
  token text not null unique,
  expected_value text not null unique,
  status text not null default 'pending' check (status in ('pending', 'verified', 'failed', 'expired')),
  attempts integer not null default 0 check (attempts >= 0),
  last_checked_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trust_scans (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  scan_type text not null check (scan_type in ('free_preview', 'advanced_paid', 'pro_advanced', 'recheck')),
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  overall_status text check (overall_status in ('looks_promising', 'needs_improvement', 'needs_closer_review', 'approved', 'not_approved')),
  score integer,
  raw_scan_data jsonb not null default '{}'::jsonb,
  findings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.site_reports (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  report_level text not null check (report_level in ('free', 'advanced')),
  title text,
  summary text,
  score integer,
  status text not null default 'draft',
  sections jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  ai_summary text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  badge_token text not null unique,
  status text not null default 'inactive' check (status in ('inactive', 'active', 'expired', 'suspended', 'revoked')),
  public_slug text not null unique,
  issued_at timestamptz,
  expires_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recheck_requests (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  message text,
  status text not null default 'requested' check (status in ('requested', 'queued', 'running', 'complete', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_report_messages (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.billing_entitlements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  website_id uuid references public.websites (id) on delete cascade,
  entitlement_type text not null check (entitlement_type in ('free', 'one_time_site', 'pro')),
  status text not null default 'active' check (status in ('active', 'inactive', 'expired', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_id text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists websites_owner_id_idx on public.websites (owner_id);
create index if not exists websites_business_id_idx on public.websites (business_id);
create index if not exists websites_normalized_domain_idx on public.websites (normalized_domain);
create index if not exists domain_verifications_owner_id_idx on public.domain_verifications (owner_id);
create index if not exists domain_verifications_website_id_idx on public.domain_verifications (website_id);
create index if not exists trust_scans_owner_id_idx on public.trust_scans (owner_id);
create index if not exists trust_scans_website_id_idx on public.trust_scans (website_id);
create index if not exists site_reports_owner_id_idx on public.site_reports (owner_id);
create index if not exists site_reports_website_id_idx on public.site_reports (website_id);
create index if not exists badges_owner_id_idx on public.badges (owner_id);
create index if not exists badges_website_id_idx on public.badges (website_id);
create index if not exists recheck_requests_owner_id_idx on public.recheck_requests (owner_id);
create index if not exists recheck_requests_website_id_idx on public.recheck_requests (website_id);
create index if not exists ai_report_messages_owner_id_idx on public.ai_report_messages (owner_id);
create index if not exists ai_report_messages_website_id_idx on public.ai_report_messages (website_id);
create index if not exists billing_entitlements_owner_id_idx on public.billing_entitlements (owner_id);
create index if not exists billing_entitlements_website_id_idx on public.billing_entitlements (website_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
before update on public.businesses
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_websites_updated_at on public.websites;
create trigger set_websites_updated_at
before update on public.websites
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_site_reports_updated_at on public.site_reports;
create trigger set_site_reports_updated_at
before update on public.site_reports
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at
before update on public.badges
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_recheck_requests_updated_at on public.recheck_requests;
create trigger set_recheck_requests_updated_at
before update on public.recheck_requests
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_billing_entitlements_updated_at on public.billing_entitlements;
create trigger set_billing_entitlements_updated_at
before update on public.billing_entitlements
for each row
execute function public.set_current_timestamp_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.websites enable row level security;
alter table public.domain_verifications enable row level security;
alter table public.trust_scans enable row level security;
alter table public.site_reports enable row level security;
alter table public.badges enable row level security;
alter table public.recheck_requests enable row level security;
alter table public.ai_report_messages enable row level security;
alter table public.billing_entitlements enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "businesses_owner_or_admin_all" on public.businesses;
create policy "businesses_owner_or_admin_all"
on public.businesses
for all
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "websites_owner_or_admin_all" on public.websites;
create policy "websites_owner_or_admin_all"
on public.websites
for all
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "domain_verifications_owner_or_admin_all" on public.domain_verifications;
create policy "domain_verifications_owner_or_admin_all"
on public.domain_verifications
for all
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "trust_scans_select_own_or_admin" on public.trust_scans;
create policy "trust_scans_select_own_or_admin"
on public.trust_scans
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "trust_scans_insert_own_or_admin" on public.trust_scans;
create policy "trust_scans_insert_own_or_admin"
on public.trust_scans
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "trust_scans_update_own_or_admin" on public.trust_scans;
create policy "trust_scans_update_own_or_admin"
on public.trust_scans
for update
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "site_reports_select_own_or_admin" on public.site_reports;
create policy "site_reports_select_own_or_admin"
on public.site_reports
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "site_reports_insert_own_or_admin" on public.site_reports;
create policy "site_reports_insert_own_or_admin"
on public.site_reports
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "site_reports_update_own_or_admin" on public.site_reports;
create policy "site_reports_update_own_or_admin"
on public.site_reports
for update
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "badges_select_own_or_admin" on public.badges;
create policy "badges_select_own_or_admin"
on public.badges
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "badges_insert_own_or_admin" on public.badges;
create policy "badges_insert_own_or_admin"
on public.badges
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "badges_update_own_or_admin" on public.badges;
create policy "badges_update_own_or_admin"
on public.badges
for update
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "recheck_requests_select_own_or_admin" on public.recheck_requests;
create policy "recheck_requests_select_own_or_admin"
on public.recheck_requests
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "recheck_requests_insert_own_or_admin" on public.recheck_requests;
create policy "recheck_requests_insert_own_or_admin"
on public.recheck_requests
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "recheck_requests_update_own_or_admin" on public.recheck_requests;
create policy "recheck_requests_update_own_or_admin"
on public.recheck_requests
for update
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "ai_report_messages_select_own_or_admin" on public.ai_report_messages;
create policy "ai_report_messages_select_own_or_admin"
on public.ai_report_messages
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "ai_report_messages_insert_own_or_admin" on public.ai_report_messages;
create policy "ai_report_messages_insert_own_or_admin"
on public.ai_report_messages
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "billing_entitlements_select_own_or_admin" on public.billing_entitlements;
create policy "billing_entitlements_select_own_or_admin"
on public.billing_entitlements
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "billing_entitlements_insert_own_or_admin" on public.billing_entitlements;
create policy "billing_entitlements_insert_own_or_admin"
on public.billing_entitlements
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "billing_entitlements_update_own_or_admin" on public.billing_entitlements;
create policy "billing_entitlements_update_own_or_admin"
on public.billing_entitlements
for update
using (auth.uid() = owner_id or public.is_admin())
with check (auth.uid() = owner_id or public.is_admin());

commit;
