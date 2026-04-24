import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function DashBilling({ biz, status }) {
  const domain = biz.url || 'tuneteachers.com';
  const isFree    = status === 'free';
  const isOnetime = status === 'onetime' || status === 'approved' || status === 'not_approved';
  const isPro     = status === 'pro';

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Billing</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your Crozora plan and coverage.</p>
      </div>

      {/* Free */}
      <div className="glass-card rounded-2xl p-6" style={{ border: isFree ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)' }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-semibold">Free Trust Preview</p>
              {isFree && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>Current Plan</span>}
            </div>
            <p className="text-xs text-slate-500">Limited preview only. No badge, no public trust page, no detailed report.</p>
          </div>
          <span className="text-xl font-bold font-space text-white flex-shrink-0 ml-4">$0</span>
        </div>
        {isFree && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Verify This Website — $30
            </button>
            <button className="flex-1 py-3 rounded-xl font-semibold text-sm"
              style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.75)' }}>
              Start Crozora Pro — $20/month
            </button>
          </div>
        )}
      </div>

      {/* One-time */}
      <div className="glass-card rounded-2xl p-6" style={{ border: isOnetime ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(59,130,246,0.1)' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-white font-semibold">One-Time Site Verification</p>
              {isOnetime && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>Current Plan</span>}
            </div>
            <p className="text-xs text-slate-500">$30 one-time. Covers one specific website. Includes basic report and badge access if approved.</p>
            {isOnetime && (
              <div className="mt-3 space-y-1.5">
                {[
                  ['Covered website', domain],
                  ['Payment type', 'One-time'],
                  ['Badge access', 'Depends on approval'],
                  ['Public trust page', 'Depends on approval'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{k}: <span className="text-white">{v}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="text-xl font-bold font-space text-white flex-shrink-0">$30</span>
        </div>
        {isOnetime && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Verify Another Website — $30
            </button>
            <button className="flex-1 py-3 rounded-xl font-semibold text-sm"
              style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.75)' }}>
              Upgrade to Crozora Pro — $20/month
            </button>
          </div>
        )}
        {!isOnetime && !isFree && (
          <button className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            Verify {domain} — $30
          </button>
        )}
        {isFree && (
          <button className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            Verify This Website — $30
          </button>
        )}
      </div>

      {/* Pro */}
      <div className="glass-card rounded-2xl p-6" style={{
        border: isPro ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
        boxShadow: isPro ? '0 0 30px rgba(139,92,246,0.08)' : 'none',
      }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-white font-semibold">Crozora Pro</p>
              {isPro && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}>Current Plan</span>}
            </div>
            <p className="text-xs text-slate-500">$20/month. Multiple websites, advanced reports, ongoing monitoring, and badge access for approved sites.</p>
            {isPro && (
              <div className="mt-3 space-y-1.5">
                {[
                  ['Renewal date', 'May 15, 2026'],
                  ['Websites covered', '3'],
                  ['Active badges', '1'],
                  ['Billing history', 'Available below'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-violet-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{k}: <span className="text-white">{v}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-xl font-bold font-space text-white">$20</span>
            <span className="text-slate-500 text-xs">/mo</span>
          </div>
        </div>
        {isPro && (
          <div className="mt-4 space-y-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2 font-medium">Billing History</p>
              {[['Apr 15, 2026', '$20.00', 'Paid'], ['Mar 15, 2026', '$20.00', 'Paid'], ['Feb 15, 2026', '$20.00', 'Paid']].map(([date, amt, status_]) => (
                <div key={date} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <span className="text-xs text-slate-400">{date}</span>
                  <span className="text-xs text-white">{amt}</span>
                  <span className="text-xs status-active px-1.5 py-0.5 rounded-full">{status_}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl font-semibold text-sm text-red-400 transition-all hover:bg-red-500/5"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
              Cancel Subscription
            </button>
          </div>
        )}
        {!isPro && (
          <button className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}>
            Start Crozora Pro — $20/month
          </button>
        )}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">Payment never guarantees badge approval. Crozora badges are only active for websites that pass verification.</p>
      </div>
    </div>
  );
}