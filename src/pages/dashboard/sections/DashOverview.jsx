import { Globe, FileText, Award, Eye, ScanLine, RefreshCw, Plus, BarChart3, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_CONFIGS = {
  free: {
    title: 'Free Trust Preview',
    subtitle: 'Your free preview is complete.',
    planLabel: 'Free Preview',
    cards: [
      { icon: Globe,    label: 'Website Ownership', val: 'Verified',      cls: 'status-active' },
      { icon: ScanLine, label: 'Trust Preview',      val: 'Complete',      cls: 'status-active' },
      { icon: FileText, label: 'Site Report',        val: 'Locked',        cls: 'status-expired' },
      { icon: Award,    label: 'Badge',              val: 'Not Available', cls: 'status-expired' },
      { icon: Eye,      label: 'Public Trust Page',  val: 'Not Available', cls: 'status-expired' },
    ],
  },
  onetime: {
    title: 'One-Time Site Verification',
    subtitle: null, // dynamic
    planLabel: 'One-Time Verification',
    cards: [
      { icon: Globe,    label: 'Website Ownership', val: 'Verified',          cls: 'status-active' },
      { icon: FileText, label: 'Basic Site Report',  val: 'Available',         cls: 'status-active' },
      { icon: Award,    label: 'Badge Decision',     val: 'Pending Review',    cls: 'status-pending' },
      { icon: Eye,      label: 'Public Trust Page',  val: 'Pending Approval',  cls: 'status-pending' },
      { icon: Globe,    label: 'Plan Coverage',      val: 'This site only',    cls: 'status-pending' },
    ],
  },
  pro: {
    title: 'Crozora Pro',
    subtitle: 'Manage multiple websites, advanced reports, badge access, and ongoing rechecks.',
    planLabel: 'Crozora Pro',
    cards: [
      { icon: Globe,    label: 'Websites Monitored', val: '3',        cls: 'status-active' },
      { icon: Award,    label: 'Active Badges',       val: '1',        cls: 'status-active' },
      { icon: RefreshCw,label: 'Rechecks Due',        val: '1',        cls: 'status-pending' },
      { icon: Eye,      label: 'Public Pages Active', val: '1',        cls: 'status-active' },
      { icon: BarChart3, label: 'Advanced Reports',   val: 'Available', cls: 'status-active' },
    ],
  },
  approved: {
    title: 'Badge Approved',
    subtitle: 'This website can display a Crozora Verified Badge.',
    planLabel: 'Approved',
    cards: [
      { icon: Globe,    label: 'Website Ownership',  val: 'Verified',         cls: 'status-active' },
      { icon: ScanLine, label: 'Verification Status', val: 'Approved',         cls: 'status-active' },
      { icon: Award,    label: 'Badge',               val: 'Ready to Install', cls: 'status-active' },
      { icon: Eye,      label: 'Public Trust Page',   val: 'Active',           cls: 'status-active' },
      { icon: RefreshCw,label: 'Last Checked',        val: 'April 2026',       cls: 'status-active' },
    ],
  },
  not_approved: {
    title: 'Website Not Approved Yet',
    subtitle: 'This website does not currently qualify for a Crozora Verified Badge.',
    planLabel: 'Not Approved',
    cards: [
      { icon: Globe,    label: 'Website Ownership', val: 'Verified',   cls: 'status-active' },
      { icon: ScanLine, label: 'Review Status',      val: 'Complete',  cls: 'status-active' },
      { icon: Award,    label: 'Badge Status',       val: 'Not Approved', cls: 'status-expired' },
      { icon: Eye,      label: 'Public Trust Page',  val: 'Not Active',   cls: 'status-expired' },
      { icon: RefreshCw,label: 'Recheck',            val: 'Available',    cls: 'status-pending' },
    ],
  },
};

function FreeActionPanel({ previewResult, setSection }) {
  const passed = previewResult !== 'failed' && previewResult !== 'review';
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-4 rounded-xl mb-1"
        style={{ background: passed ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)', border: passed ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(245,158,11,0.15)' }}>
        {passed
          ? <><CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-slate-300">Your website shows early trust signals. To activate a Crozora Verified Badge, choose one-time verification for this website or start Crozora Pro.</p></>
          : <><AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-slate-300">Your website needs improvement before verification. Upgrade to see what needs attention and how to improve your website.</p></>
        }
      </div>
      <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
        {passed ? 'Verify This Website — $30' : 'Unlock Site Report — $30'}
      </button>
      <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.8)' }}>
        Start Crozora Pro — $20/month
      </button>
    </div>
  );
}

function OnetimeActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-3">Crozora is reviewing this website. You'll see the badge decision here once the review is complete.</p>
      <button onClick={() => setSection('report')} className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
        View Basic Site Report
      </button>
    </div>
  );
}

function ProActionPanel({ setSection }) {
  const SITES = [
    { domain: 'tuneteachers.com',    ownership: 'Verified', report: 'Advanced',   badge: 'Active',   page: 'Active',     checked: 'Apr 2026' },
    { domain: 'examplecleaning.com', ownership: 'Verified', report: 'Needs work', badge: 'No badge', page: 'Not active', checked: 'Apr 2026' },
    { domain: 'samplecoach.com',     ownership: 'Pending',  report: 'Not scanned',badge: 'No badge', page: 'Not active', checked: '—' },
  ];
  const badgeCls = (b) => b === 'Active' ? 'status-active' : 'status-expired';
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.12)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
              {['Website','Ownership','Report','Badge','Public Page','Last Checked'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SITES.map((s) => (
              <tr key={s.domain} className="hover:bg-blue-500/3 transition-colors" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <td className="px-3 py-2.5 font-mono text-blue-300">{s.domain}</td>
                <td className="px-3 py-2.5"><span className={`${s.ownership === 'Verified' ? 'status-active' : 'status-pending'} px-1.5 py-0.5 rounded-full text-xs`}>{s.ownership}</span></td>
                <td className="px-3 py-2.5 text-slate-400">{s.report}</td>
                <td className="px-3 py-2.5"><span className={`${badgeCls(s.badge)} px-1.5 py-0.5 rounded-full text-xs`}>{s.badge}</span></td>
                <td className="px-3 py-2.5 text-slate-400">{s.page}</td>
                <td className="px-3 py-2.5 text-slate-500">{s.checked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
        <Plus size={14} /> Add Another Website
      </button>
    </div>
  );
}

function ApprovedActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-1">This website is approved for a Crozora Verified Badge. Install your badge or view your public trust page.</p>
      <button onClick={() => setSection('badge')} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
        Install Badge
      </button>
      <button onClick={() => setSection('public')} className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
        View Public Trust Page
      </button>
    </div>
  );
}

function NotApprovedActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-1">Improve this website before requesting a recheck. Fix the recommended items in your site report first.</p>
      <button onClick={() => setSection('report')} className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
        View Site Report
      </button>
      <button onClick={() => setSection('rechecks')} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
        Request Recheck
      </button>
    </div>
  );
}

export default function DashOverview({ biz, status, setSection }) {
  const domain = biz.url || 'tuneteachers.com';
  const name = biz.name || domain;
  const cfg = STATUS_CONFIGS[status] || STATUS_CONFIGS.free;
  const subtitle = cfg.subtitle ?? `This verification applies only to ${domain}.`;

  const renderAction = () => {
    switch (status) {
      case 'onetime':      return <OnetimeActionPanel setSection={setSection} />;
      case 'pro':          return <ProActionPanel setSection={setSection} />;
      case 'approved':     return <ApprovedActionPanel setSection={setSection} />;
      case 'not_approved': return <NotApprovedActionPanel setSection={setSection} />;
      default:             return <FreeActionPanel previewResult={biz.previewResult} setSection={setSection} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top area */}
      <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-space text-white">{cfg.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-mono text-blue-300 px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>{domain}</span>
              {status === 'onetime' && (
                <span className="text-xs text-amber-400 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  This one-time payment covers only this website
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cfg.cards.map(({ icon: Icon, label, val, cls }, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.12)' }}>
              <Icon size={15} className="text-blue-400" />
            </div>
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{val}</span>
          </div>
        ))}
      </div>

      {/* Main action panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <ArrowRight size={14} className="text-blue-400" /> Next Steps
          </h2>
          {renderAction()}
        </div>

        {/* Recent activity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { msg: 'Free trust preview completed',       time: 'Just now',   color: '#60a5fa' },
              { msg: 'Website ownership verified via DNS', time: '10 min ago', color: '#34d399' },
              { msg: 'DNS TXT record detected',            time: '10 min ago', color: '#34d399' },
              { msg: 'Business info submitted',            time: '15 min ago', color: '#94a3b8' },
              { msg: 'Onboarding started',                 time: '20 min ago', color: '#94a3b8' },
            ].map(({ msg, time, color }) => (
              <div key={msg} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <p className="text-xs text-slate-300 flex-1">{msg}</p>
                <span className="text-xs text-slate-600 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Website details */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Website Details</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Account Name', name],
            ['Account Email', biz.email || 'owner@example.com'],
            ['Business Category', biz.category || 'Education'],
            ['Website URL', domain],
            ['Normalized Domain', domain.replace(/^www\./, '')],
            ['Country', biz.country || 'United States'],
            ['Website Builder', biz.builder || 'WordPress'],
            ['Service Type', biz.serviceType || 'Online only'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.08)' }}>
              <p className="text-xs text-slate-500 mb-0.5">{k}</p>
              <p className="text-sm text-white font-medium">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}