import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getLatestWebsiteForOwner, listWebsitesByOwner } from '@/services/websites';
import { getLatestDomainVerification } from '@/services/domainVerification';
import { getLatestScanForWebsite } from '@/services/trustScans';
import { getLatestReportForWebsite } from '@/services/reports';
import { getLatestBadgeForWebsite } from '@/services/badges';
import {
  getActiveEntitlementForOwner,
  getEffectiveEntitlementForWebsite,
  listActiveEntitlementsForOwner,
} from '@/services/billingEntitlements';
import {
  Shield, LayoutDashboard, Globe, FileText, Award, Eye, CreditCard,
  Settings, LogOut, Menu, X, RefreshCw
} from 'lucide-react';

import DashOverview from './sections/DashOverview';
import DashWebsites from './sections/DashWebsites';
import DashReport from './sections/DashReport';
import DashBadge from './sections/DashBadge';
import DashPublicPage from './sections/DashPublicPage';
import DashRechecks from './sections/DashRechecks';
import DashBilling from './sections/DashBilling';
import DashSettings from './sections/DashSettings';

function mapServiceType(value) {
  if (value === 'both') return 'Both online and in-person';
  if (value === 'in_person') return 'In-person only';
  return 'Online only';
}

function mapPlan(activeEntitlement, website) {
  if (activeEntitlement?.entitlement_type === 'pro') return 'pro';
  if (website?.plan_coverage === 'one_time' || activeEntitlement?.entitlement_type === 'one_time_site') return 'onetime';
  return website?.plan_coverage || 'free';
}

function mapDashboardStatus(primaryWebsite, activeEntitlement) {
  if (activeEntitlement?.entitlement_type === 'pro') return 'pro';
  if (primaryWebsite?.badge_status === 'active' || primaryWebsite?.badge_status === 'approved' || primaryWebsite?.verification_status === 'approved') {
    return 'approved';
  }
  if (primaryWebsite?.verification_status === 'not_approved') return 'not_approved';
  if (primaryWebsite?.plan_coverage === 'one_time' || activeEntitlement?.entitlement_type === 'one_time_site') return 'onetime';
  return 'free';
}

function mapWebsiteRow(website, latestVerification, latestScan, latestReport, latestBadge, effectiveEntitlement) {
  return {
    id: website.id,
    businessId: website.business_id,
    name: website.businesses?.business_name || website.normalized_domain,
    url: website.normalized_domain,
    email: website.businesses?.business_email || '',
    category: website.businesses?.category || '',
    builder: website.website_builder || '',
    contactUrl: website.contact_page_url || '',
    privacyUrl: website.privacy_policy_url || '',
    termsUrl: website.terms_policy_url || '',
    reviewUrl: website.review_profile_url || '',
    country: website.businesses?.country || '',
    state: website.businesses?.state_region || '',
    city: website.businesses?.city || '',
    serviceType: mapServiceType(website.businesses?.service_type),
    previewResult: latestScan?.overall_status || 'looks_promising',
    previewStatus: website.preview_status,
    ownershipVerified: website.ownership_status === 'verified',
    ownershipStatus: website.ownership_status,
    verificationStatus: website.verification_status,
    badgeStatus: website.badge_status,
    publicPageStatus: website.public_page_status,
    planCoverage: website.plan_coverage,
    lastCheckedAt: website.last_checked_at,
    nextRecheckAt: website.next_recheck_at,
    latestVerification,
    latestScan,
    latestReport,
    latestBadge,
    effectiveEntitlement,
  };
}

function normalizeSection(value) {
  const allowed = new Set(['overview', 'websites', 'report', 'badge', 'public', 'rechecks', 'billing', 'settings']);
  return allowed.has(value) ? value : 'overview';
}

export function useBizData() {
  const [biz, setBiz] = useState(null);
  const { user } = useAuth();
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshTick((value) => value + 1);
    window.addEventListener('crozora-biz-refresh', handleRefresh);
    return () => window.removeEventListener('crozora-biz-refresh', handleRefresh);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const savedRaw = sessionStorage.getItem('crozora_biz');
        const saved = savedRaw ? JSON.parse(savedRaw) : null;

        if (saved && active) {
          setBiz(saved);
        }

        if (!user?.id) {
          if (active) {
            setBiz(saved || { websites: [] });
          }
          return;
        }

        const [activeEntitlement, activeEntitlements, websites] = await Promise.all([
          getActiveEntitlementForOwner(user.id),
          listActiveEntitlementsForOwner(user.id),
          listWebsitesByOwner(user.id),
        ]);

        if (!active) {
          return;
        }

        if (!websites.length) {
          setBiz((prev) => ({
            ...(prev || {}),
            ...(saved || {}),
            websites: [],
            activeEntitlements,
          }));
          return;
        }

        const websiteRows = await Promise.all(
          websites.map(async (website) => {
            const [latestVerification, latestScan, latestReport, latestBadge] = await Promise.all([
              getLatestDomainVerification(website.id),
              getLatestScanForWebsite(website.id),
              getLatestReportForWebsite(website.id),
              getLatestBadgeForWebsite(website.id),
            ]);
            const effectiveEntitlement = getEffectiveEntitlementForWebsite(
              website.id,
              activeEntitlements,
              website.plan_coverage
            );

            return mapWebsiteRow(website, latestVerification, latestScan, latestReport, latestBadge, effectiveEntitlement);
          })
        );

        if (!active) return;

        const latestWebsite = await getLatestWebsiteForOwner(user.id);
        const primaryWebsite = websiteRows.find((row) => row.id === latestWebsite?.id) || websiteRows[0];
        const primaryEntitlement =
          primaryWebsite?.effectiveEntitlement
          || getEffectiveEntitlementForWebsite(primaryWebsite?.id, activeEntitlements, latestWebsite?.plan_coverage);
        const mapped = {
          businessId: primaryWebsite.businessId,
          websiteId: primaryWebsite.id,
          ownershipVerificationId: primaryWebsite.latestVerification?.id || saved?.ownershipVerificationId,
          name: primaryWebsite.name,
          url: primaryWebsite.url,
          email: primaryWebsite.email,
          category: primaryWebsite.category,
          builder: primaryWebsite.builder,
          contactUrl: primaryWebsite.contactUrl,
          privacyUrl: primaryWebsite.privacyUrl,
          termsUrl: primaryWebsite.termsUrl,
          reviewUrl: primaryWebsite.reviewUrl,
          country: primaryWebsite.country,
          state: primaryWebsite.state,
          city: primaryWebsite.city,
          serviceType: primaryWebsite.serviceType,
          plan: mapPlan(primaryEntitlement || activeEntitlement, latestWebsite),
          previewResult: primaryWebsite.previewResult,
          previewStatus: primaryWebsite.previewStatus,
          ownershipVerified: primaryWebsite.ownershipVerified,
          ownershipStatus: primaryWebsite.ownershipStatus,
          verificationStatus: primaryWebsite.verificationStatus,
          badgeStatus: primaryWebsite.badgeStatus,
          publicPageStatus: primaryWebsite.publicPageStatus,
          planCoverage: primaryWebsite.planCoverage,
          lastCheckedAt: primaryWebsite.lastCheckedAt,
          nextRecheckAt: primaryWebsite.nextRecheckAt,
          latestVerification: primaryWebsite.latestVerification,
          latestScan: primaryWebsite.latestScan,
          latestReport: primaryWebsite.latestReport,
          latestBadge: primaryWebsite.latestBadge,
          activeEntitlement: primaryEntitlement || activeEntitlement,
          activeEntitlements,
          websites: websiteRows,
          dashboardStatus: mapDashboardStatus(latestWebsite, primaryEntitlement || activeEntitlement),
        };

        const merged = {
          ...(saved || {}),
          ...mapped,
        };

        sessionStorage.setItem('crozora_biz', JSON.stringify(merged));
        setBiz((prev) => ({
          ...(prev || {}),
          ...merged,
        }));
      } catch {
        if (active) {
          setBiz((prev) => prev || { websites: [] });
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user?.id, refreshTick]);

  return biz || { websites: [] };
}

const NAV = [
  { icon: LayoutDashboard, label: 'Overview', key: 'overview' },
  { icon: Globe, label: 'Websites', key: 'websites' },
  { icon: FileText, label: 'Site Report', key: 'report' },
  { icon: Award, label: 'Badge Setup', key: 'badge' },
  { icon: Eye, label: 'Public Trust Page', key: 'public' },
  { icon: RefreshCw, label: 'Rechecks', key: 'rechecks' },
  { icon: CreditCard, label: 'Billing', key: 'billing' },
  { icon: Settings, label: 'Settings', key: 'settings' },
];

const PLAN_PILL = {
  free: { label: 'Free Preview', style: { background: 'rgba(71,85,105,0.25)', color: '#94a3b8', border: '1px solid rgba(71,85,105,0.4)' } },
  onetime: { label: 'One-Time Verification', style: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' } },
  pro: { label: 'Crozora Pro', style: { background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' } },
  approved: { label: 'Approved', style: { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' } },
  not_approved: { label: 'Not Approved', style: { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' } },
};

function Sidebar({ section, setSection, open, setOpen, biz, status }) {
  const { logout } = useAuth();
  const domain = biz.url || 'your-site.com';
  const name = biz.name || domain;
  const pill = PLAN_PILL[status] || PLAN_PILL.free;

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-60 flex-shrink-0 flex flex-col transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: '#080f1f', borderRight: '1px solid rgba(59,130,246,0.1)' }}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
              <Shield size={13} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-base">Crozora</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setOpen(false)}><X size={16} /></button>
        </div>

        <div className="mx-3 mt-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
          <p className="text-xs text-slate-500 mb-0.5">Current Business</p>
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs font-mono text-slate-500 truncate mb-2">{domain}</p>
          <span className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" style={pill.style}>{pill.label}</span>
        </div>

        <nav className="px-3 py-3 flex flex-col gap-0.5 flex-1">
          {NAV.map(({ icon: Icon, label, key }) => (
            <button key={key} onClick={() => { setSection(key); setOpen(false); }} className={`sidebar-item w-full text-left ${section === key ? 'active' : ''}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <button onClick={() => logout()} className="sidebar-item w-full">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function MainDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const [section, setSection] = useState(() => normalizeSection(searchParams.get('section')));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState('free');
  const biz = useBizData();

  useEffect(() => {
    const nextSection = normalizeSection(requestedSection);
    setSection((current) => (current === nextSection ? current : nextSection));
  }, [requestedSection]);

  useEffect(() => {
    const currentSectionParam = requestedSection;
    if (section === 'overview') {
      if (currentSectionParam) {
        setSearchParams({}, { replace: true });
      }
      return;
    }

    if (currentSectionParam !== section) {
      setSearchParams({ section }, { replace: true });
    }
  }, [section, requestedSection, setSearchParams]);

  useEffect(() => {
    if (biz.dashboardStatus) {
      setStatus(biz.dashboardStatus);
      return;
    }

    if (biz.plan) {
      const map = { onetime: 'onetime', pro: 'pro' };
      setStatus(map[biz.plan] || 'free');
    }
  }, [biz.dashboardStatus, biz.plan]);

  const props = { biz, status, setSection, setStatus };

  const renderSection = () => {
    switch (section) {
      case 'websites': return <DashWebsites {...props} />;
      case 'report': return <DashReport {...props} />;
      case 'badge': return <DashBadge {...props} />;
      case 'public': return <DashPublicPage {...props} />;
      case 'rechecks': return <DashRechecks {...props} />;
      case 'billing': return <DashBilling {...props} />;
      case 'settings': return <DashSettings {...props} />;
      default: return <DashOverview {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050b18' }}>
      <Sidebar section={section} setSection={setSection} open={sidebarOpen} setOpen={setSidebarOpen} biz={biz} status={status} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 flex items-center gap-4 md:hidden" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: '#080f1f' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400"><Menu size={20} /></button>
          <span className="text-white font-bold font-space">Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
