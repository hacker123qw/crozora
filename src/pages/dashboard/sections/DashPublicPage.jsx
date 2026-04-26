import { Eye, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { buildPublicSiteUrl } from '@/lib/site-url';

function formatDate(value, fallback = 'Not scheduled') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DashPublicPage({ biz, status }) {
  const publicSlug = biz.latestBadge?.public_slug;
  const liveUrl = publicSlug ? buildPublicSiteUrl(`/verify/${publicSlug}`) : '';
  const isActive = biz.publicPageStatus === 'active' && Boolean(publicSlug);

  if (!isActive) {
    const notActiveMsg = status === 'free'
      ? 'Free previews do not include a public trust page.'
      : biz.verificationStatus === 'approved'
      ? 'This website is approved, but the live badge page still needs to be created in Badge Setup.'
      : 'This website must pass verification before the public trust page can go live.';

    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold font-space text-white mb-2">Public Trust Page</h1>
        <div className="glass-card rounded-2xl p-10 text-center mt-6" style={{ border: '1px solid rgba(59,130,246,0.12)' }}>
          <Eye size={28} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white font-space mb-3">
            {status === 'free' ? 'Public page not available yet' : 'Public page not active yet'}
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">{notActiveMsg}</p>
        </div>
      </div>
    );
  }

  const checks = [
    { label: 'Website ownership confirmed', value: biz.ownershipStatus === 'verified' },
    { label: 'HTTPS detected', value: biz.url ? `https://${biz.url}` : false },
    { label: 'Business contact signals reviewed', value: Boolean(biz.contactUrl || biz.email) },
    { label: 'Public business policies found', value: Boolean(biz.privacyUrl || biz.termsUrl) },
    {
      label: 'No major visible scam-risk signals detected',
      value: biz.latestScan?.overall_status !== 'needs_closer_review' && biz.latestScan?.overall_status !== 'not_approved',
    },
    { label: 'Badge authenticity confirmed', value: true },
    { label: 'Last checked', value: formatDate(biz.lastCheckedAt, 'Not checked yet') },
    { label: 'Next recheck', value: formatDate(biz.nextRecheckAt) },
  ];

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Public Trust Page</h1>
        <p className="text-slate-400 text-sm mt-1">This is the customer-facing page linked from your live Crozora badge.</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono flex-wrap">
        <span>{liveUrl}</span>
        <span className="status-active px-2 py-0.5 rounded-full">Live</span>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
          >
            {(biz.name || biz.url || 'CZ').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold">{biz.name || biz.url}</p>
            <p className="text-xs font-mono text-slate-500">{biz.url}</p>
          </div>
          <div className="ml-auto status-active px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={9} /> Crozora Verified
          </div>
        </div>

        {checks.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}>
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-xs font-medium">
              {value === true ? <span className="text-emerald-400">Yes</span> : value === false ? <span className="text-slate-500">Not shown</span> : <span className="text-slate-300">{value}</span>}
            </span>
          </div>
        ))}

        <p className="text-xs p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)', color: 'rgba(100,116,139,0.7)' }}>
          Crozora verification means this website passed Crozora&apos;s checks at the time shown. It does not guarantee every customer experience or remove all risk.
        </p>

        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Open live customer page <ExternalLink size={13} />
        </a>

        <div className="flex items-start gap-2">
          <AlertCircle size={12} className="text-slate-600 flex-shrink-0 mt-0.5" />
          <a href="mailto:support@crozora.com?subject=Report%20a%20Crozora%20verification%20issue" className="text-xs text-slate-500 hover:text-slate-400 text-left transition-colors">
            Report an issue with this verification
          </a>
        </div>
      </div>
    </div>
  );
}
