import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { setTemporaryPlanForWebsite } from '@/services/billingEntitlements';

function formatDate(value, fallback = 'Not set') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DashBilling({ biz, status }) {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testError, setTestError] = useState('');
  const domain = biz.url || 'No website saved';
  const isFree = status === 'free';
  const isOnetime = status === 'onetime' || status === 'approved' || status === 'not_approved';
  const isPro = status === 'pro';
  const entitlement = biz.activeEntitlement;
  const paymentType = entitlement?.stripe_payment_id ? 'One-time payment recorded' : 'One-time';
  const renewalDate = formatDate(entitlement?.ends_at, 'Not scheduled yet');
  const entitlementStatus = entitlement?.status || 'inactive';
  const testModeEnabled = Boolean(import.meta.env.DEV);

  const announceRefresh = () => {
    window.dispatchEvent(new Event('crozora-biz-refresh'));
  };

  const applyTemporaryPlan = async (plan) => {
    if (!user?.id || !biz.websiteId) {
      setTestError('Please finish website setup before changing the temporary test plan.');
      return;
    }

    setIsApplying(plan);
    setTestMessage('');
    setTestError('');

    try {
      await setTemporaryPlanForWebsite({
        websiteId: biz.websiteId,
        plan,
      });

      if (plan === 'free') {
        setTestMessage('Temporary test plan set to Free.');
      }

      if (plan === 'one_time') {
        setTestMessage('Temporary test plan set to One-Time for this website.');
      }

      if (plan === 'pro') {
        setTestMessage('Temporary test plan set to Pro.');
      }

      announceRefresh();
    } catch (error) {
      setTestError(error.message || 'Could not update the temporary test plan.');
    } finally {
      setIsApplying('');
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Billing</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your Crozora plan and coverage.</p>
      </div>

      {testModeEnabled ? (
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-white font-semibold mb-2">Temporary Test Plan Controls</h2>
              <p className="text-sm text-slate-400 mb-4">
                This is a temporary developer-only tool for testing the full dashboard with real backend entitlement rows before Stripe is built.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => applyTemporaryPlan('free')}
                  disabled={Boolean(isApplying)}
                  className="py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(59,130,246,0.3)', opacity: isApplying ? 0.7 : 1 }}
                >
                  {isApplying === 'free' ? 'Applying...' : 'Set Free'}
                </button>
                <button
                  onClick={() => applyTemporaryPlan('one_time')}
                  disabled={Boolean(isApplying)}
                  className="py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(59,130,246,0.3)', opacity: isApplying ? 0.7 : 1 }}
                >
                  {isApplying === 'one_time' ? 'Applying...' : 'Set One-Time'}
                </button>
                <button
                  onClick={() => applyTemporaryPlan('pro')}
                  disabled={Boolean(isApplying)}
                  className="py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.3)', opacity: isApplying ? 0.7 : 1 }}
                >
                  {isApplying === 'pro' ? 'Applying...' : 'Set Pro'}
                </button>
              </div>
              {testMessage ? (
                <div className="mt-4 rounded-xl px-4 py-3 text-sm text-emerald-100" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)' }}>
                  {testMessage}
                </div>
              ) : null}
              {testError ? (
                <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-100" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
                  {testError}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

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
      </div>

      <div className="glass-card rounded-2xl p-6" style={{ border: isOnetime ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(59,130,246,0.1)' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-white font-semibold">One-Time Site Verification</p>
              {isOnetime && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>Current Plan</span>}
            </div>
            <p className="text-xs text-slate-500">$30 one-time. Covers one specific website. Includes an advanced report and badge access if approved.</p>
            {isOnetime && (
              <div className="mt-3 space-y-1.5">
                {[
                  ['Covered website', domain],
                  ['Payment type', paymentType],
                  ['Badge access', 'Depends on approval'],
                  ['Public trust page', 'Depends on approval'],
                  ['Entitlement status', entitlementStatus],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{key}: <span className="text-white">{value}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="text-xl font-bold font-space text-white flex-shrink-0">$30</span>
        </div>
      </div>

      <div
        className="glass-card rounded-2xl p-6"
        style={{
          border: isPro ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
          boxShadow: isPro ? '0 0 30px rgba(139,92,246,0.08)' : 'none',
        }}
      >
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
                  ['Renewal date', renewalDate],
                  ['Websites covered', String((biz.websites || []).length || (domain ? 1 : 0))],
                  ['Active badges', biz.badgeStatus === 'active' ? '1' : '0'],
                  ['Billing history', entitlement?.stripe_subscription_id ? 'Linked to subscription' : 'Not connected yet'],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-violet-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{key}: <span className="text-white">{value}</span></span>
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
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">Payment never guarantees badge approval. Crozora badges are only active for websites that pass verification.</p>
      </div>
    </div>
  );
}
