import { Globe, CheckCircle, Award, Eye, Plus, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSiteModal({ onClose, isPro, onStartOnboarding, onOpenBilling }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-5" style={{ border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-space text-white">Add Another Website</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={18} /></button>
        </div>
        {isPro ? (
          <>
            <p className="text-sm text-slate-400">
              Add each new website through the onboarding flow so ownership verification, scanning, and reports are saved correctly.
            </p>
            <button onClick={onStartOnboarding} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Add Website via Onboarding
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">Additional websites require another one-time verification or Crozora Pro.</p>
            <div className="space-y-3">
              <button onClick={onOpenBilling} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                Verify Another Website - $30
              </button>
              <button onClick={onOpenBilling} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.7)' }}>
                Start Crozora Pro - $20/month
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatPreviewValue(site) {
  if (site.previewStatus === 'complete') {
    if (site.previewResult === 'looks_promising') return 'Looks promising';
    if (site.previewResult === 'needs_improvement') return 'Needs improvement';
    if (site.previewResult === 'needs_closer_review') return 'Needs review';
    return 'Complete';
  }
  if (site.previewStatus === 'running') return 'Running';
  return 'Not started';
}

function formatBadgeValue(site) {
  if (site.badgeStatus === 'active') return 'Active';
  if (site.badgeStatus === 'approved') return 'Approved';
  if (site.badgeStatus === 'unavailable') return 'Not available';
  return site.badgeStatus || 'Unavailable';
}

function formatOwnershipValue(site) {
  if (site.ownershipStatus === 'verified') return 'Verified';
  if (site.ownershipStatus === 'pending') return 'Pending';
  return 'Not started';
}

function formatDate(value, fallback = 'Not checked yet') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function DashWebsites({ biz, status }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const isPro = status === 'pro';
  const domain = biz.url || 'No website saved';
  const name = biz.name || domain;
  const websites = Array.isArray(biz.websites) ? biz.websites : [];

  const badgeCls = (value) => value === 'Active' || value === 'Approved' ? 'status-active' : value === 'Not available' ? 'status-expired' : 'status-pending';
  const ownerCls = (value) => value === 'Verified' ? 'status-active' : 'status-pending';

  return (
    <div className="space-y-6">
      {showModal && (
        <AddSiteModal
          onClose={() => setShowModal(false)}
          isPro={isPro}
          onStartOnboarding={() => {
            setShowModal(false);
            navigate('/onboarding');
          }}
          onOpenBilling={() => {
            setShowModal(false);
            navigate('/dashboard/home?section=billing');
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space text-white">Websites</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isPro ? 'All websites saved under your Crozora Pro account.' : `Coverage for one website - ${domain}.`}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Plus size={14} /> Add Website
        </button>
      </div>

      {!isPro && (
        <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(251,191,36,0.8)' }}>
          <strong className="text-amber-300">One website covered:</strong> This one-time verification applies only to <span className="font-mono">{domain}</span>. Additional websites require another $30 one-time verification or Crozora Pro.
        </div>
      )}

      {isPro ? (
        <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  {['Website', 'Ownership', 'Trust Preview', 'Badge Status', 'Public Page', 'Last Checked', 'Next Action'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-medium text-slate-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {websites.map((site) => {
                  const ownershipValue = formatOwnershipValue(site);
                  const previewValue = formatPreviewValue(site);
                  const badgeValue = formatBadgeValue(site);
                  const publicPageValue = site.publicPageStatus === 'active' ? 'Active' : 'Not active';
                  const nextAction = ownershipValue !== 'Verified'
                    ? 'Complete DNS'
                    : badgeValue === 'Active' || badgeValue === 'Approved'
                    ? 'Manage Badge'
                    : site.latestReport
                    ? 'View Report'
                    : 'Run Preview';

                  return (
                    <tr key={site.id} className="hover:bg-blue-500/3 transition-colors" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-blue-300 text-xs">{site.url}</p>
                        <p className="text-slate-500 text-xs">{site.name}</p>
                      </td>
                      <td className="px-4 py-3"><span className={`${ownerCls(ownershipValue)} px-2 py-0.5 rounded-full text-xs`}>{ownershipValue}</span></td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{previewValue}</td>
                      <td className="px-4 py-3"><span className={`${badgeCls(badgeValue)} px-2 py-0.5 rounded-full text-xs`}>{badgeValue}</span></td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{publicPageValue}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(site.lastCheckedAt)}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">{nextAction}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 max-w-lg" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
              {(name[0] || 'T').toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold">{name}</p>
              <p className="text-xs font-mono text-slate-500">{domain}</p>
            </div>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${biz.planCoverage === 'pro' ? 'status-active' : 'status-pending'}`}>
              {biz.planCoverage === 'pro' ? 'Pro' : status === 'free' ? 'Free' : 'Covered'}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { icon: Globe, label: 'Ownership', val: formatOwnershipValue(biz), cls: formatOwnershipValue(biz) === 'Verified' ? 'status-active' : 'status-pending' },
              { icon: CheckCircle, label: 'Trust Preview', val: formatPreviewValue(biz), cls: biz.previewStatus === 'complete' ? 'status-active' : 'status-pending' },
              { icon: Globe, label: 'Plan Coverage', val: status === 'free' ? 'Free Preview' : `${domain} only`, cls: status === 'free' ? 'status-pending' : 'status-active' },
              { icon: Award, label: 'Badge Status', val: formatBadgeValue(biz), cls: badgeCls(formatBadgeValue(biz)) },
              { icon: Eye, label: 'Public Page', val: biz.publicPageStatus === 'active' ? 'Active' : 'Not active', cls: biz.publicPageStatus === 'active' ? 'status-active' : 'status-expired' },
              { icon: AlertCircle, label: 'Last Checked', val: formatDate(biz.lastCheckedAt), cls: biz.lastCheckedAt ? 'status-active' : 'status-pending' },
            ].map(({ icon: Icon, label, val, cls }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
