import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Shield, CheckCircle, ExternalLink, AlertTriangle, Globe } from 'lucide-react';

const publicChecks = [
  'Website ownership confirmed',
  'HTTPS detected',
  'Business contact information reviewed',
  'Public business policies found',
  'No major scam-risk signals detected',
  'Badge authenticity confirmed',
];

const statusConfigs = {
  active: {
    label: 'Active',
    color: '#34d399',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    showChecks: true,
  },
  expired: {
    label: 'Expired',
    color: '#f87171',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    iconBg: 'rgba(239,68,68,0.15)',
    showChecks: false,
    message: 'This business\'s Crozora verification has expired. The badge is no longer valid.',
  },
  suspended: {
    label: 'Suspended',
    color: '#f87171',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    iconBg: 'rgba(239,68,68,0.15)',
    showChecks: false,
    message: 'This business\'s badge has been temporarily suspended pending review.',
  },
  not_found: {
    label: 'Not Found',
    color: '#94a3b8',
    bg: 'rgba(100,116,139,0.06)',
    border: 'rgba(100,116,139,0.15)',
    iconBg: 'rgba(100,116,139,0.15)',
    showChecks: false,
    message: 'No verification record was found for this business.',
  },
};

export default function PublicVerifyPage() {
  const { businessId } = useParams();
  const [activeStatus, setActiveStatus] = useState('active');
  const [showReport, setShowReport] = useState(false);

  const config = statusConfigs[activeStatus];
  const businessName = businessId === 'tuneteachers' ? 'TuneTeachers' : businessId || 'Unknown Business';

  return (
    <div className="min-h-screen grid-pattern" style={{ background: '#050b18' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-white font-space font-bold">Crozora</span>
        </Link>
        <span className="text-xs text-slate-500">Verification Page</span>
      </header>

      {/* Background halo */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />

      <div className="max-w-lg mx-auto px-6 py-12 relative">
        {/* Demo state switcher */}
        <div className="glass-card rounded-xl p-3 mb-6">
          <p className="text-xs text-slate-500 mb-2 px-1">Demo: Switch verification status</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusConfigs).map(([key, val]) => (
              <button key={key} onClick={() => setActiveStatus(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeStatus === key ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.05)',
                  border: activeStatus === key ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                  color: activeStatus === key ? '#60a5fa' : 'rgba(148,163,184,0.7)',
                }}>{val.label}</button>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="glass-card rounded-3xl overflow-hidden glow-blue" style={{ border: `1px solid ${config.border}` }}>
          {/* Top band */}
          <div className="px-6 py-3 text-center text-xs font-medium" style={{ background: config.bg, color: config.color, borderBottom: `1px solid ${config.border}` }}>
            Crozora Verification Page — Official
          </div>

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: config.iconBg, border: `1px solid ${config.border}` }}>
              {activeStatus === 'active' ? (
                <CheckCircle size={30} className="text-white" />
              ) : (
                <AlertTriangle size={26} style={{ color: config.color }} />
              )}
            </div>

            {/* Business name */}
            <h1 className="text-2xl font-space font-bold text-white mb-3">
              {activeStatus === 'active' ? `${businessName} is Crozora Verified` : `${businessName} — Verification Issue`}
            </h1>

            {/* Status badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
              {activeStatus === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              Status: {config.label}
            </div>

            {activeStatus === 'active' ? (
              <>
                {/* Details */}
                <div className="text-left space-y-2 mb-6">
                  {[['Website', businessId ? `${businessId}.com` : 'tuneteachers.com'], ['Last Verified', 'April 2026']].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2.5 px-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Checks */}
                <div className="text-left space-y-2 mb-6">
                  {publicChecks.map(check => (
                    <div key={check} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{check}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <a href={`https://${businessId}.com`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                    <Globe size={15} />
                    Visit Business Website
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => setShowReport(!showReport)}
                    className="py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                  >
                    Report an Issue
                  </button>
                  {showReport && (
                    <div className="mt-2 p-4 rounded-xl text-left" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <p className="text-xs font-semibold text-red-400 mb-2">Report this badge</p>
                      <textarea rows={3} placeholder="Describe the issue..." className="w-full rounded-lg px-3 py-2 text-xs text-slate-300 resize-none outline-none"
                        style={{ background: 'rgba(5,11,24,0.5)', border: '1px solid rgba(59,130,246,0.12)' }} />
                      <button className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(239,68,68,0.3)' }}>
                        Submit Report
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm text-slate-400 mb-6">{config.message}</p>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                  Learn about Crozora Verification
                </Link>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="px-6 py-4 text-center" style={{ borderTop: '1px solid rgba(59,130,246,0.08)', background: 'rgba(5,11,24,0.4)' }}>
            <p className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
              Crozora verification means this business passed Crozora's trust checks at the time shown. It does not guarantee every customer experience or remove all risk.
            </p>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-600 hover:text-slate-500 transition-colors">
            Powered by Crozora · crozora.com
          </Link>
        </div>
      </div>
    </div>
  );
}