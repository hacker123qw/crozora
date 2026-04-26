begin;

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

create index if not exists recheck_requests_owner_id_idx on public.recheck_requests (owner_id);
create index if not exists recheck_requests_website_id_idx on public.recheck_requests (website_id);
create index if not exists ai_report_messages_owner_id_idx on public.ai_report_messages (owner_id);
create index if not exists ai_report_messages_website_id_idx on public.ai_report_messages (website_id);

drop trigger if exists set_recheck_requests_updated_at on public.recheck_requests;
create trigger set_recheck_requests_updated_at
before update on public.recheck_requests
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.recheck_requests enable row level security;
alter table public.ai_report_messages enable row level security;

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

commit;
