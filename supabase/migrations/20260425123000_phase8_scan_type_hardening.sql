begin;

alter table public.trust_scans
drop constraint if exists trust_scans_scan_type_check;

alter table public.trust_scans
add constraint trust_scans_scan_type_check
check (scan_type in ('free_preview', 'advanced_paid', 'pro_advanced', 'recheck'));

update public.site_reports
set report_level = 'advanced'
where report_level = 'basic';

alter table public.site_reports
drop constraint if exists site_reports_report_level_check;

alter table public.site_reports
add constraint site_reports_report_level_check
check (report_level in ('free', 'advanced'));

commit;
