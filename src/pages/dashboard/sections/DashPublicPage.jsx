import { Eye, CheckCircle, AlertCircle } from 'lucide-react';

export default function DashPublicPage({ biz, status }) {
  const domain = biz.url || 'tuneteachers.com';
  const name = biz.name || domain;
  const initials = name.slice(0, 2).toUpperCase();
  const isActive = status === 'approved';

  const notActiveMsg = status === 'free'
    ? 'Free previews do not include a public trust page.'
    : 'This website must pass verification before a public trust page can be activated.';

  if (!isActive) {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold font-space text-white mb-2">Public Trust Page</h1>
        <div className="glass-card rounded-2xl p-10 text-center mt-6" style={{ border: '1px solid rgba(59,130,246,0.12)' }}>
          <Eye size={28} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white font-space mb-3">
            {status === 'free' ? 'Public Trust Page Not Available' : 'Public Trust Page Not Active'}
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">{notActiveMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Public Trust Page</h1>
        <p className="text-slate-400 text-sm mt-1">This is what customers see when they click your Crozora badge.</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <span>crozora.com/verify/{domain.replace(/\./g, '-')}</span>
        <span className="status-active px-2 py-0.5 rounded-full">Live</span>
      </div>

      {/* Customer-facing preview */}
      <div className="glass-card rounded-2xl p-6 space-y-4" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>{initials}</div>
          <div>
            <p className="text-white font-bold">{name}</p>
            <p className="text-xs font-mono text-slate-500">{domain}</p>
          </div>
          <div className="ml-auto status-active px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={9} /> Crozora Verified
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Customer-visible information only</p>

        {[
          ['Website ownership confirmed', true],
          ['HTTPS detected', true],
          ['Business contact signals reviewed', true],
          ['Public business policies found', true],
          ['No major visible scam-risk signals detected', true],
          ['Badge authenticity confirmed', true],
          ['Last checked', 'April 2026'],
          ['Next recheck', 'May 2026'],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}>
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-xs font-medium">
              {val === true
                ? <span className="text-emerald-400">✓ Yes</span>
                : <span className="text-slate-300">{val}</span>}
            </span>
          </div>
        ))}

        <div className="pt-3" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(100,116,139,0.7)' }}>
            Crozora verification means this website passed Crozora's checks at the time shown. It does not guarantee every customer experience or remove all risk.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle size={12} className="text-slate-600 flex-shrink-0 mt-0.5" />
          <button className="text-xs text-slate-500 hover:text-slate-400 text-left transition-colors">
            Report an issue with this business →
          </button>
        </div>
      </div>
    </div>
  );
}