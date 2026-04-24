import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Globe, FileText, Award, Eye, CreditCard,
  Settings, LogOut, Menu, X, RefreshCw
} from 'lucide-react';

import DashOverview from './sections/DashOverview';
import DashWebsites from './sections/DashWebsites';
import DashReport from './sections/DashReport';
import DashBadge from './sections/DashBadge';
import DashPublicPage from './sections/DashPublicPage';
import DashBilling from './sections/DashBilling';
import DashSettings from './sections/DashSettings';

// ─── Prototype Switcher ───────────────────────────────────────────────────────
const PROTO_STATES = [
  { key: 'free',        label: 'Free' },
  { key: 'onetime',     label: 'One-Time Verification' },
  { key: 'pro',         label: 'Pro' },
  { key: 'approved',    label: 'Approved Badge' },
  { key: 'not_approved',label: 'Not Approved' },
];

function PrototypeSwitcher({ status, setStatus }) {
  return (
    <div className="mb-6 p-3 rounded-xl flex flex-wrap gap-2 items-center"
      style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)' }}>
      <span className="text-xs font-semibold text-violet-400 flex items-center gap-1 mr-1">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
        Prototype View:
      </span>
      {PROTO_STATES.map(s => (
        <button key={s.key} onClick={() => setStatus(s.key)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            background: status === s.key ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.06)',
            border: status === s.key ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(139,92,246,0.12)',
            color: status === s.key ? '#c4b5fd' : 'rgba(196,181,253,0.35)',
          }}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ─── Hook: load biz data from session ────────────────────────────────────────
export function useBizData() {
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('crozora_biz');
      if (saved) setBiz(JSON.parse(saved));
      else {
        // Allow direct access without onboarding (demo mode)
        setBiz({
          name: 'TuneTeachers',
          url: 'tuneteachers.com',
          email: 'hello@tuneteachers.com',
          category: 'Education',
          builder: 'WordPress',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          serviceType: 'Online only',
          plan: 'free',
          previewResult: 'passed',
        });
      }
    } catch {
      setBiz({ name: 'TuneTeachers', url: 'tuneteachers.com', plan: 'free' });
    }
  }, []);
  return biz || {};
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: 'Overview',          key: 'overview' },
  { icon: Globe,           label: 'Websites',          key: 'websites' },
  { icon: FileText,        label: 'Site Report',       key: 'report' },
  { icon: Award,           label: 'Badge Setup',       key: 'badge' },
  { icon: Eye,             label: 'Public Trust Page', key: 'public' },
  { icon: RefreshCw,       label: 'Rechecks',          key: 'rechecks' },
  { icon: CreditCard,      label: 'Billing',           key: 'billing' },
  { icon: Settings,        label: 'Settings',          key: 'settings' },
];

const PLAN_PILL = {
  free:         { label: 'Free Preview',          style: { background: 'rgba(71,85,105,0.25)', color: '#94a3b8', border: '1px solid rgba(71,85,105,0.4)' } },
  onetime:      { label: 'One-Time Verification', style: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' } },
  pro:          { label: 'Crozora Pro',           style: { background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' } },
  approved:     { label: 'Approved',              style: { background: 'rgba(16,185,129,0.1)',  color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' } },
  not_approved: { label: 'Not Approved',          style: { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' } },
};

function Sidebar({ section, setSection, open, setOpen, biz, status }) {
  const navigate = useNavigate();
  const domain = biz.url || 'your-site.com';
  const name = biz.name || domain;
  const pill = PLAN_PILL[status] || PLAN_PILL.free;

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-60 flex-shrink-0 flex flex-col transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#080f1f', borderRight: '1px solid rgba(59,130,246,0.1)' }}>

        {/* Logo */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
              <Shield size={13} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-base">Crozora</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setOpen(false)}><X size={16} /></button>
        </div>

        {/* Business card */}
        <div className="mx-3 mt-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
          <p className="text-xs text-slate-500 mb-0.5">Current Business</p>
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs font-mono text-slate-500 truncate mb-2">{domain}</p>
          <span className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" style={pill.style}>{pill.label}</span>
        </div>

        {/* Nav */}
        <nav className="px-3 py-3 flex flex-col gap-0.5 flex-1">
          {NAV.map(({ icon: Icon, label, key }) => (
            <button key={key} onClick={() => { setSection(key); setOpen(false); }}
              className={`sidebar-item w-full text-left ${section === key ? 'active' : ''}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>

        {/* Signout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <button onClick={() => navigate('/')} className="sidebar-item w-full">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Rechecks (simple placeholder) ───────────────────────────────────────────
function Rechecks({ status, setSection }) {
  const isLocked = status === 'free';
  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-3xl font-bold font-space text-white">Rechecks</h1>
      {isLocked ? (
        <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <RefreshCw size={28} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Rechecks Not Available</h2>
          <p className="text-sm text-slate-400 mb-6">Rechecks are available on paid plans. Upgrade to request a recheck after making improvements.</p>
          <button onClick={() => setSection('billing')} className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            View Plan Options
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Last Recheck</h3>
              <span className="text-xs status-active px-2 py-0.5 rounded-full">Complete</span>
            </div>
            <p className="text-xs text-slate-400">April 2026 — All signals reviewed. No major changes detected.</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Next Recheck</h3>
              <span className="text-xs status-pending px-2 py-0.5 rounded-full">Scheduled</span>
            </div>
            <p className="text-xs text-slate-400">May 2026 — Crozora will automatically review your website signals.</p>
          </div>
          <button className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            Request Early Recheck
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MainDashboard() {
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState('free');
  const biz = useBizData();

  useEffect(() => {
    if (biz.plan) {
      const map = { onetime: 'onetime', pro: 'pro' };
      setStatus(map[biz.plan] || 'free');
    }
  }, [biz.plan]);

  const props = { biz, status, setSection, setStatus };

  const renderSection = () => {
    switch (section) {
      case 'websites': return <DashWebsites {...props} />;
      case 'report':   return <DashReport {...props} />;
      case 'badge':    return <DashBadge {...props} />;
      case 'public':   return <DashPublicPage {...props} />;
      case 'rechecks': return <Rechecks {...props} />;
      case 'billing':  return <DashBilling {...props} />;
      case 'settings': return <DashSettings {...props} />;
      default:         return <DashOverview {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050b18' }}>
      <Sidebar section={section} setSection={setSection} open={sidebarOpen} setOpen={setSidebarOpen} biz={biz} status={status} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 flex items-center gap-4 md:hidden"
          style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: '#080f1f' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400"><Menu size={20} /></button>
          <span className="text-white font-bold font-space">Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <PrototypeSwitcher status={status} setStatus={setStatus} />
          {renderSection()}
        </main>
      </div>
    </div>
  );
}