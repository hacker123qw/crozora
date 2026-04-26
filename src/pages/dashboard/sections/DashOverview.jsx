import { Globe, FileText, Award, Eye, ScanLine, RefreshCw, BarChart3, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_CONFIGS = {
  free: {
    title: 'Free Trust Preview',
    subtitle: 'Your free preview is complete.',
  },
  onetime: {
    title: 'One-Time Site Verification',
    subtitle: null,
  },
  pro: {
    title: 'Crozora Pro',
    subtitle: 'Manage your saved websites, reports, badges, and rechecks from one place.',
  },
  approved: {
    title: 'Badge Approved',
    subtitle: 'This website can display a Crozora Verified Badge.',
  },
  not_approved: {
    title: 'Website Not Approved Yet',
    subtitle: 'This website does not currently qualify for a Crozora Verified Badge.',
  },
};

function formatMonth(value, fallback = 'Not available') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatPreviewLabel(item) {
  if (item.previewStatus === 'complete') {
    if (item.previewResult === 'looks_promising') return 'Looks promising';
    if (item.previewResult === 'needs_improvement') return 'Needs improvement';
    if (item.previewResult === 'needs_closer_review') return 'Needs review';
    return 'Complete';
  }
  if (item.previewStatus === 'running') return 'Running';
  return 'Not started';
}

function formatOwnershipLabel(item) {
  if (item.ownershipStatus === 'verified') return 'Verified';
  if (item.ownershipStatus === 'pending') return 'Pending';
  return 'Not started';
}

function formatBadgeLabel(item) {
  if (item.badgeStatus === 'active') return 'Active';
  if (item.badgeStatus === 'approved') return 'Approved';
  if (item.badgeStatus === 'unavailable') return 'Not available';
  return item.badgeStatus || 'Unavailable';
}

function formatPublicPageLabel(item) {
  return item.publicPageStatus === 'active' ? 'Active' : 'Not active';
}

function FreeActionPanel({ previewResult, setSection }) {
  const passed = previewResult !== 'failed' && previewResult !== 'review' && previewResult !== 'needs_closer_review';
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-4 rounded-xl mb-1" style={{ background: passed ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)', border: passed ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(245,158,11,0.15)' }}>
        {passed ? (
          <>
            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">Your website shows early trust signals. To activate a Crozora Verified Badge, choose one-time verification for this website or start Crozora Pro.</p>
          </>
        ) : (
          <>
            <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">Your website needs improvement before verification. Upgrade to see what needs attention and how to improve your website.</p>
          </>
        )}
      </div>
      <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
        {passed ? 'Verify This Website - $30' : 'Unlock Site Report - $30'}
      </button>
      <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.8)' }}>
        Start Crozora Pro - $20/month
      </button>
    </div>
  );
}

function OnetimeActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-3">Crozora is reviewing this website. You&apos;ll see the badge decision here once the review is complete.</p>
      <button onClick={() => setSection('report')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
        View Advanced Site Report
      </button>
    </div>
  );
}

function ProActionPanel({ websites }) {
  const badgeCls = (value) => value === 'Active' || value === 'Approved' ? 'status-active' : 'status-expired';

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.12)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
              {['Website', 'Ownership', 'Report', 'Badge', 'Public Page', 'Last Checked'].map((heading) => (
                <th key={heading} className="px-3 py-2.5 text-left font-medium text-slate-500">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {websites.map((site) => {
              const ownershipLabel = formatOwnershipLabel(site);
              const badgeLabel = formatBadgeLabel(site);
              return (
                <tr key={site.id} className="hover:bg-blue-500/3 transition-colors" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <td className="px-3 py-2.5 font-mono text-blue-300">{site.url}</td>
                  <td className="px-3 py-2.5"><span className={`${ownershipLabel === 'Verified' ? 'status-active' : 'status-pending'} px-1.5 py-0.5 rounded-full text-xs`}>{ownershipLabel}</span></td>
                  <td className="px-3 py-2.5 text-slate-400">{site.latestReport ? 'Available' : formatPreviewLabel(site)}</td>
                  <td className="px-3 py-2.5"><span className={`${badgeCls(badgeLabel)} px-1.5 py-0.5 rounded-full text-xs`}>{badgeLabel}</span></td>
                  <td className="px-3 py-2.5 text-slate-400">{formatPublicPageLabel(site)}</td>
                  <td className="px-3 py-2.5 text-slate-500">{formatMonth(site.lastCheckedAt, 'Not checked yet')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApprovedActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-1">This website is approved for a Crozora Verified Badge. Install your badge or view your public trust page.</p>
      <button onClick={() => setSection('badge')} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
        Install Badge
      </button>
      <button onClick={() => setSection('public')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
        View Public Trust Page
      </button>
    </div>
  );
}

function NotApprovedActionPanel({ setSection }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400 mb-1">Improve this website before requesting a recheck. Fix the recommended items in your site report first.</p>
      <button onClick={() => setSection('report')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
        View Site Report
      </button>
      <button onClick={() => setSection('rechecks')} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
        Request Recheck
      </button>
    </div>
  );
}

export default function DashOverview({ biz, status, setSection }) {
  const domain = biz.url || 'No website saved';
  const name = biz.name || domain;
  const websites = Array.isArray(biz.websites) ? biz.websites : [];
  const ownershipLabel = formatOwnershipLabel(biz);
  const previewLabel = formatPreviewLabel(biz);
  const badgeLabel = formatBadgeLabel(biz);
  const publicPageLabel = formatPublicPageLabel(biz);
  const proCounts = {
    websites: websites.length,
    activeBadges: websites.filter((site) => site.badgeStatus === 'active').length,
    activePages: websites.filter((site) => site.publicPageStatus === 'active').length,
    rechecksDue: websites.filter((site) => Boolean(site.nextRecheckAt)).length,
    reportsReady: websites.filter((site) => Boolean(site.latestReport)).length,
  };
  const cfg = { ...(STATUS_CONFIGS[status] || STATUS_CONFIGS.free) };

  if (status === 'free') {
    cfg.cards = [
      { icon: Globe, label: 'Website Ownership', val: ownershipLabel, cls: biz.ownershipStatus === 'verified' ? 'status-active' : 'status-pending' },
      { icon: ScanLine, label: 'Trust Preview', val: previewLabel, cls: biz.previewStatus === 'complete' ? 'status-active' : 'status-pending' },
      { icon: FileText, label: 'Site Report', val: biz.latestReport ? 'Stored' : 'Locked', cls: biz.latestReport ? 'status-pending' : 'status-expired' },
      { icon: Award, label: 'Badge', val: badgeLabel, cls: biz.badgeStatus === 'active' || biz.badgeStatus === 'approved' ? 'status-active' : 'status-expired' },
      { icon: Eye, label: 'Public Trust Page', val: publicPageLabel, cls: biz.publicPageStatus === 'active' ? 'status-active' : 'status-expired' },
    ];
  }

  if (status === 'onetime') {
    cfg.cards = [
      { icon: Globe, label: 'Website Ownership', val: ownershipLabel, cls: biz.ownershipStatus === 'verified' ? 'status-active' : 'status-pending' },
      { icon: FileText, label: 'Advanced Site Report', val: biz.latestReport ? 'Available' : 'Pending', cls: biz.latestReport ? 'status-active' : 'status-pending' },
      { icon: Award, label: 'Badge Decision', val: biz.verificationStatus === 'pending' ? 'Pending review' : biz.verificationStatus === 'approved' ? 'Approved' : biz.verificationStatus === 'not_approved' ? 'Not approved' : 'Pending review', cls: biz.verificationStatus === 'approved' ? 'status-active' : 'status-pending' },
      { icon: Eye, label: 'Public Trust Page', val: publicPageLabel, cls: biz.publicPageStatus === 'active' ? 'status-active' : 'status-pending' },
      { icon: Globe, label: 'Plan Coverage', val: 'This site only', cls: 'status-pending' },
    ];
  }

  if (status === 'pro') {
    cfg.cards = [
      { icon: Globe, label: 'Websites Monitored', val: String(proCounts.websites), cls: 'status-active' },
      { icon: Award, label: 'Active Badges', val: String(proCounts.activeBadges), cls: proCounts.activeBadges ? 'status-active' : 'status-pending' },
      { icon: RefreshCw, label: 'Rechecks Due', val: String(proCounts.rechecksDue), cls: proCounts.rechecksDue ? 'status-pending' : 'status-active' },
      { icon: Eye, label: 'Public Pages Active', val: String(proCounts.activePages), cls: proCounts.activePages ? 'status-active' : 'status-pending' },
      { icon: BarChart3, label: 'Reports Ready', val: String(proCounts.reportsReady), cls: proCounts.reportsReady ? 'status-active' : 'status-pending' },
    ];
  }

  if (status === 'approved') {
    cfg.cards = [
      { icon: Globe, label: 'Website Ownership', val: ownershipLabel, cls: 'status-active' },
      { icon: ScanLine, label: 'Verification Status', val: 'Approved', cls: 'status-active' },
      { icon: Award, label: 'Badge', val: badgeLabel === 'Active' ? 'Active' : 'Ready to install', cls: 'status-active' },
      { icon: Eye, label: 'Public Trust Page', val: publicPageLabel, cls: biz.publicPageStatus === 'active' ? 'status-active' : 'status-pending' },
      { icon: RefreshCw, label: 'Last Checked', val: formatMonth(biz.lastCheckedAt, 'Not checked yet'), cls: 'status-active' },
    ];
  }

  if (status === 'not_approved') {
    cfg.cards = [
      { icon: Globe, label: 'Website Ownership', val: ownershipLabel, cls: biz.ownershipStatus === 'verified' ? 'status-active' : 'status-pending' },
      { icon: ScanLine, label: 'Review Status', val: biz.latestScan ? 'Complete' : 'Pending', cls: biz.latestScan ? 'status-active' : 'status-pending' },
      { icon: Award, label: 'Badge Status', val: 'Not approved', cls: 'status-expired' },
      { icon: Eye, label: 'Public Trust Page', val: publicPageLabel, cls: 'status-expired' },
      { icon: RefreshCw, label: 'Recheck', val: biz.nextRecheckAt ? 'Scheduled' : 'Available', cls: 'status-pending' },
    ];
  }

  const subtitle = cfg.subtitle ?? `This verification applies only to ${domain}.`;
  const activity = [
    biz.latestScan?.completed_at && { msg: 'Free trust preview stored', time: formatMonth(biz.latestScan.completed_at, 'Recently'), color: '#60a5fa' },
    biz.latestReport?.created_at && { msg: 'Site report record created', time: formatMonth(biz.latestReport.created_at, 'Recently'), color: '#60a5fa' },
    biz.latestVerification?.verified_at && { msg: 'Website ownership verified via DNS', time: formatMonth(biz.latestVerification.verified_at, 'Recently'), color: '#34d399' },
    biz.latestVerification?.created_at && { msg: 'DNS verification record generated', time: formatMonth(biz.latestVerification.created_at, 'Recently'), color: '#94a3b8' },
    biz.businessId && { msg: 'Business profile saved', time: 'In this account', color: '#94a3b8' },
  ].filter(Boolean);

  const renderAction = () => {
    switch (status) {
      case 'onetime': return <OnetimeActionPanel setSection={setSection} />;
      case 'pro': return <ProActionPanel websites={websites} />;
      case 'approved': return <ApprovedActionPanel setSection={setSection} />;
      case 'not_approved': return <NotApprovedActionPanel setSection={setSection} />;
      default: return <FreeActionPanel previewResult={biz.previewResult} setSection={setSection} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-space text-white">{cfg.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-mono text-blue-300 px-2 py-0.5 rounded-md" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>{domain}</span>
              {status === 'onetime' && (
                <span className="text-xs text-amber-400 px-2 py-0.5 rounded-md" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  This one-time payment covers only this website
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cfg.cards.map(({ icon: Icon, label, val, cls }, index) => (
          <div key={index} className="glass-card rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.12)' }}>
              <Icon size={15} className="text-blue-400" />
            </div>
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{val}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <ArrowRight size={14} className="text-blue-400" /> Next Steps
          </h2>
          {renderAction()}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map(({ msg, time, color }) => (
              <div key={msg} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <p className="text-xs text-slate-300 flex-1">{msg}</p>
                <span className="text-xs text-slate-600 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Website Details</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Account Name', name],
            ['Account Email', biz.email || 'owner@example.com'],
            ['Business Category', biz.category || 'Not provided'],
            ['Website URL', domain],
            ['Normalized Domain', domain.replace(/^www\./, '')],
            ['Country', biz.country || 'Not provided'],
            ['Website Builder', biz.builder || 'Not provided'],
            ['Service Type', biz.serviceType || 'Not provided'],
            ['Ownership Status', ownershipLabel],
            ['Preview Status', previewLabel],
            ['Badge Status', badgeLabel],
            ['Public Page', publicPageLabel],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.08)' }}>
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className="text-sm text-white font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
