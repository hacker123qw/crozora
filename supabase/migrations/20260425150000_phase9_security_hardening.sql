begin;

create or replace function public.guard_website_sensitive_updates()
returns trigger
language plpgsql
as $$
declare
  jwt_role text := current_setting('request.jwt.claim.role', true);
begin
  if jwt_role = 'service_role' or current_user = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.ownership_status is distinct from old.ownership_status
    or new.preview_status is distinct from old.preview_status
    or new.verification_status is distinct from old.verification_status
    or new.badge_status is distinct from old.badge_status
    or new.public_page_status is distinct from old.public_page_status
    or new.plan_coverage is distinct from old.plan_coverage
    or new.last_checked_at is distinct from old.last_checked_at
    or new.next_recheck_at is distinct from old.next_recheck_at then
    raise exception 'Direct updates to protected website status fields are not allowed.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_website_sensitive_updates on public.websites;
create trigger guard_website_sensitive_updates
before update on public.websites
for each row
execute function public.guard_website_sensitive_updates();

create or replace function public.guard_domain_verification_updates()
returns trigger
language plpgsql
as $$
declare
  jwt_role text := current_setting('request.jwt.claim.role', true);
begin
  if jwt_role = 'service_role' or current_user = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.status is distinct from old.status
    or new.attempts is distinct from old.attempts
    or new.last_checked_at is distinct from old.last_checked_at
    or new.verified_at is distinct from old.verified_at then
    raise exception 'Direct updates to domain verification status fields are not allowed.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_domain_verification_updates on public.domain_verifications;
create trigger guard_domain_verification_updates
before update on public.domain_verifications
for each row
execute function public.guard_domain_verification_updates();

drop policy if exists "domain_verifications_owner_or_admin_all" on public.domain_verifications;
drop policy if exists "domain_verifications_select_own_or_admin" on public.domain_verifications;
create policy "domain_verifications_select_own_or_admin"
on public.domain_verifications
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "domain_verifications_insert_own_or_admin" on public.domain_verifications;
create policy "domain_verifications_insert_own_or_admin"
on public.domain_verifications
for insert
with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "domain_verifications_update_admin_only" on public.domain_verifications;
create policy "domain_verifications_update_admin_only"
on public.domain_verifications
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "badges_select_own_or_admin" on public.badges;
create policy "badges_select_own_or_admin"
on public.badges
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "badges_insert_own_or_admin" on public.badges;
drop policy if exists "badges_update_own_or_admin" on public.badges;
drop policy if exists "badges_insert_admin_only" on public.badges;
create policy "badges_insert_admin_only"
on public.badges
for insert
with check (public.is_admin());

drop policy if exists "badges_update_admin_only" on public.badges;
create policy "badges_update_admin_only"
on public.badges
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "badges_delete_admin_only" on public.badges;
create policy "badges_delete_admin_only"
on public.badges
for delete
using (public.is_admin());

drop policy if exists "billing_entitlements_select_own_or_admin" on public.billing_entitlements;
create policy "billing_entitlements_select_own_or_admin"
on public.billing_entitlements
for select
using (auth.uid() = owner_id or public.is_admin());

drop policy if exists "billing_entitlements_insert_own_or_admin" on public.billing_entitlements;
drop policy if exists "billing_entitlements_update_own_or_admin" on public.billing_entitlements;
drop policy if exists "billing_entitlements_insert_admin_only" on public.billing_entitlements;
create policy "billing_entitlements_insert_admin_only"
on public.billing_entitlements
for insert
with check (public.is_admin());

drop policy if exists "billing_entitlements_update_admin_only" on public.billing_entitlements;
create policy "billing_entitlements_update_admin_only"
on public.billing_entitlements
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "billing_entitlements_delete_admin_only" on public.billing_entitlements;
create policy "billing_entitlements_delete_admin_only"
on public.billing_entitlements
for delete
using (public.is_admin());

commit;
