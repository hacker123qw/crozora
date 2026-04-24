import { Lock, FileText, CheckCircle, AlertTriangle, XCircle, RefreshCw, TrendingUp } from 'lucide-react';

const BASIC_PASSED = [
  'Website is served over HTTPS',
  'Domain ownership verified via DNS TXT record',
  'Contact page with email address detected',
  'Privacy policy page found on the website',
  'No active phishing reports found',
];
const BASIC_IMPROVE = [
  'Refund policy not clearly linked from homepage',
  'Review profile not claimed on major platforms',
];
const BASIC_RECHECK = [
  'Fix the items listed above',
  'Submit a recheck request from the Rechecks page',
  'Crozora will review updated signals within a few days',
];

const ADVANCED_PASSED = [...BASIC_PASSED, 'Terms of service clearly accessible', 'Service clarity score: high'];
const ADVANCED_IMPROVE = [...BASIC_IMPROVE, 'Site load performance may affect trust signals', 'Social proof limited on third-party platforms'];
const ADVANCED_FAILED = ['Business address not verifiable from public records'];
const ADVANCED_PRIORITY = [
  { p: 'High',   fix: 'Add a verifiable business address to your contact page' },
  { p: 'Medium', fix: 'Add your refund/return policy to homepage footer' },
  { p: 'Medium', fix: 'Claim your Google Business and Yelp profiles' },
  { p: 'Low',    fix: 'Improve third-party social proof and review presence' },
];

function SectionBlock({ title, items, color, icon: Icon }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Icon size={13} style={{ color }} /> {title}
        </h3>
        <span className="text-xs font-bold" style={{ color }}>{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
            <span className="text-sm text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashReport({ biz, status, setSection }) {
  const domain = biz.url || 'tuneteachers.com';
  const isPro = status === 'pro';
  const isOnetime = status === 'onetime' || status === 'approved' || status === 'not_approved';

  // Free state
  if (status === 'free') {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Site Report</h1>
        <div className="glass-card rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)' }}>
            <Lock size={24} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white font-space mb-3">Site Report Locked</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
            Your free preview is complete, but detailed findings are not included on the free plan. Choose one-time verification for this website or start Crozora Pro.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Unlock Basic Report — $30
            </button>
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.7)' }}>
              Start Crozora Pro — $20/month
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">{isPro ? 'Advanced Site Report' : 'Basic Site Report'}</h1>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs"
          style={{
            background: isPro ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)',
            border: isPro ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(59,130,246,0.2)',
            color: isPro ? '#c4b5fd' : '#60a5fa',
          }}>
          {isPro ? 'Crozora Pro' : `One-Time Verification — ${domain} only`}
        </div>
      </div>

      {isOnetime && !isPro && (
        <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(251,191,36,0.7)' }}>
          This report applies only to <span className="font-mono font-semibold">{domain}</span>. Additional websites require separate verification.
        </div>
      )}

      {/* Badge decision for one-time */}
      {isOnetime && !isPro && (
        <div className="p-4 rounded-xl flex items-center gap-3"
          style={{ background: status === 'approved' ? 'rgba(16,185,129,0.07)' : status === 'not_approved' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)',
            border: status === 'approved' ? '1px solid rgba(16,185,129,0.2)' : status === 'not_approved' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(245,158,11,0.2)' }}>
          {status === 'approved'
            ? <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            : status === 'not_approved'
            ? <XCircle size={18} className="text-red-400 flex-shrink-0" />
            : <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />}
          <div>
            <p className="text-white font-semibold text-sm">Badge Decision: {status === 'approved' ? 'Approved' : status === 'not_approved' ? 'Not Approved' : 'Pending Review'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{status === 'approved' ? 'This website qualifies for a Crozora Verified Badge.' : status === 'not_approved' ? 'This website does not currently qualify for a badge.' : 'Crozora is reviewing this website.'}</p>
          </div>
        </div>
      )}

      {/* Score — Pro only */}
      {isPro && (
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Trust Score Breakdown</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-space" style={{ color: '#34d399' }}>87</span>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
          </div>
          <div className="w-full h-2.5 rounded-full mb-4" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <div className="h-2.5 rounded-full" style={{ width: '87%', background: 'linear-gradient(90deg, #3b82f6, #34d399)' }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Ownership', 100], ['Security', 90], ['Policies', 85], ['Contact', 88], ['Reputation', 72], ['Scam Risk', 95]].map(([label, score]) => (
              <div key={label} className="rounded-lg p-2.5" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-bold font-space text-white">{score}<span className="text-slate-600 text-xs font-normal">/100</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionBlock title="Passed Signals" items={isPro ? ADVANCED_PASSED : BASIC_PASSED} color="#34d399" icon={CheckCircle} />
      <SectionBlock title="Needs Attention" items={isPro ? ADVANCED_IMPROVE : BASIC_IMPROVE} color="#fbbf24" icon={AlertTriangle} />
      {isPro && <SectionBlock title="Failed Checks" items={ADVANCED_FAILED} color="#f87171" icon={XCircle} />}

      {/* Prioritized fixes — Pro */}
      {isPro && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp size={13} className="text-blue-400" /> Prioritized Fixes</h3>
          <div className="space-y-2">
            {ADVANCED_PRIORITY.map(({ p, fix }) => (
              <div key={fix} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.07)' }}>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ background: p === 'High' ? 'rgba(239,68,68,0.12)' : p === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)', color: p === 'High' ? '#f87171' : p === 'Medium' ? '#fbbf24' : '#60a5fa' }}>{p}</span>
                <span className="text-sm text-slate-300">{fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recheck guidance */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><RefreshCw size={13} className="text-violet-400" /> {isPro ? 'Monitoring & Recheck History' : 'Basic Recheck Guidance'}</h3>
        {isPro ? (
          <div className="space-y-2">
            {[['Last recheck', 'April 2026'], ['Next scheduled recheck', 'May 2026'], ['Total rechecks completed', '3'], ['Monitoring status', 'Active']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <span className="text-xs text-slate-500">{k}</span>
                <span className="text-xs font-medium text-white">{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-2">
            {BASIC_RECHECK.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-blue-400 mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                <span className="text-sm text-slate-300">{s}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}