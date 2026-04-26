import { AlertTriangle, CheckCircle, ExternalLink, Globe, Shield } from 'lucide-react';

const STATUS_CONFIGS = {
  active: {
    label: 'Active',
    color: '#34d399',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
  },
  expired: {
    label: 'Expired',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    iconBg: 'rgba(245,158,11,0.16)',
  },
  suspended: {
    label: 'Suspended',
    color: '#f87171',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.24)',
    iconBg: 'rgba(239,68,68,0.15)',
  },
  not_found: {
    label: 'Not Found',
    color: '#94a3b8',
    bg: 'rgba(100,116,139,0.07)',
    border: 'rgba(100,116,139,0.2)',
    iconBg: 'rgba(100,116,139,0.14)',
  },
};

function formatDate(value, fallback = 'Not available') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PublicVerificationCard({ verification, isPreview = false }) {
  const status = verification?.status || 'not_found';
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.not_found;
  const isActive = status === 'active';
  const businessName = verification?.businessName || verification?.domain || 'Unknown website';
  const websiteUrl = verification?.websiteUrl || (verification?.domain ? `https://${verification.domain}` : null);

  return (
    <div className="glass-card rounded-3xl overflow-hidden glow-blue" style={{ border: `1px solid ${config.border}` }}>
      <div className="px-6 py-3 text-center text-xs font-medium" style={{ background: config.bg, color: config.color, borderBottom: `1px solid ${config.border}` }}>
        Crozora Verification Page
      </div>

      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: config.iconBg, border: `1px solid ${config.border}` }}>
          {isActive ? <CheckCircle size={30} className="text-white" /> : <AlertTriangle size={26} style={{ color: config.color }} />}
        </div>

        <h1 className="text-2xl font-space font-bold text-white mb-3">
          {isActive ? `${businessName} is Crozora Verified` : `${businessName} verification status`}
        </h1>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
          {isActive ? <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> : null}
          Status: {config.label}
        </div>

        {isActive ? (
          <>
            <div className="text-left space-y-2 mb-6">
              {[
                ['Website', verification?.domain || 'Not available'],
                ['Last checked', formatDate(verification?.lastCheckedAt)],
                ['Next recheck', formatDate(verification?.nextRecheckAt, 'Monitoring schedule not set')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5 px-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm text-white font-medium text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="text-left space-y-2 mb-6">
              {(verification?.checks || []).map((check) => (
                <div key={check.key || check.label} className="flex items-center gap-2.5">
                  <CheckCircle size={13} className={check.passed ? 'text-emerald-400 flex-shrink-0' : 'text-slate-600 flex-shrink-0'} />
                  <span className={`text-sm ${check.passed ? 'text-slate-300' : 'text-slate-500'}`}>{check.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
                >
                  <Globe size={15} />
                  Visit website
                  <ExternalLink size={12} />
                </a>
              ) : null}

              {!isPreview ? (
                <a
                  href="mailto:support@crozora.com?subject=Report%20a%20Crozora%20verification%20issue"
                  className="py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                >
                  Report an issue
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm text-slate-400 mb-6">{verification?.message || 'This verification page is not active right now.'}</p>
            <a href="/trust-standards" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
              <Shield size={14} />
              Learn about Crozora verification
            </a>
          </div>
        )}
      </div>

      <div className="px-6 py-4 text-center" style={{ borderTop: '1px solid rgba(59,130,246,0.08)', background: 'rgba(5,11,24,0.4)' }}>
        <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
          {verification?.disclaimer || "Crozora verification means this website passed Crozora's checks at the time shown. It does not guarantee every customer experience or remove all risk."}
        </p>
      </div>
    </div>
  );
}
