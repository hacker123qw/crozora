import { useState } from 'react';

export default function DashSettings({ biz, status }) {
  const [notifs, setNotifs] = useState({ recheck: true, badge: true, security: false, marketing: false });
  const domain = biz.url || 'tuneteachers.com';
  const name = biz.name || domain;
  const planLabel = status === 'pro' ? 'Crozora Pro — $20/month' : status === 'onetime' || status === 'approved' || status === 'not_approved' ? `One-Time Site Verification — ${domain}` : 'Free Trust Preview';

  const Row = ({ label, value }) => (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-medium text-white">{value || '—'}</span>
    </div>
  );

  const Toggle = ({ id, label, desc }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button onClick={() => setNotifs(n => ({ ...n, [id]: !n[id] }))}
        className="w-9 h-5 rounded-full transition-all flex-shrink-0 ml-4 relative"
        style={{ background: notifs[id] ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'rgba(71,85,105,0.5)' }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: notifs[id] ? '19px' : '2px' }} />
      </button>
    </div>
  );

  const SectionCard = ({ title, children, actionLabel }) => (
    <div className="glass-card rounded-2xl p-5" style={{ border: '1px solid rgba(59,130,246,0.12)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {actionLabel && (
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">{actionLabel}</button>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-lg space-y-5">
      <h1 className="text-3xl font-bold font-space text-white">Settings</h1>

      <SectionCard title="Account Information" actionLabel="Edit Account">
        <Row label="Full Name" value={name} />
        <Row label="Account Email" value={biz.email || 'owner@example.com'} />
        <Row label="Account Created" value="April 2026" />
      </SectionCard>

      <SectionCard title="Business Profile" actionLabel="Edit Business Info">
        <Row label="Business Name" value={name} />
        <Row label="Business Email" value={biz.email || 'hello@example.com'} />
        <Row label="Category" value={biz.category || 'Education'} />
        <Row label="Service Type" value={biz.serviceType || 'Online only'} />
      </SectionCard>

      <SectionCard title="Website Information" actionLabel="Change Website Builder">
        <Row label="Website URL" value={domain} />
        <Row label="Normalized Domain" value={domain.replace(/^www\./, '')} />
        <Row label="Country" value={biz.country || 'United States'} />
        <Row label="State / Region" value={biz.state || 'California'} />
        <Row label="City" value={biz.city || 'Los Angeles'} />
        <Row label="Website Builder" value={biz.builder || 'WordPress'} />
      </SectionCard>

      <SectionCard title="Plan Details" actionLabel="Manage Plan">
        <Row label="Current Plan" value={planLabel} />
        <Row label="Website Covered" value={domain} />
        <Row label="Ownership Status" value="Verified" />
        <Row label="Preview Status" value="Complete" />
        <Row label="Last Checked" value="April 2026" />
        <Row label="Next Recheck" value={status === 'free' ? 'Upgrade required' : 'May 2026'} />
      </SectionCard>

      <SectionCard title="Notification Preferences">
        <Toggle id="recheck" label="Recheck reminders" desc="Get notified when a recheck is due" />
        <Toggle id="badge" label="Badge status alerts" desc="Notify me if badge status changes" />
        <Toggle id="security" label="Security alerts" desc="Warnings about scam signals detected" />
        <Toggle id="marketing" label="Tips & product updates" desc="Occasional emails about Crozora features" />
      </SectionCard>

      <SectionCard title="Security">
        <Row label="Password" value="••••••••••" />
        <Row label="Two-Factor Auth" value="Not enabled" />
        <div className="mt-3 space-y-2">
          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/5"
            style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            Change Password
          </button>
          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/5"
            style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            Enable Two-Factor Auth
          </button>
        </div>
      </SectionCard>

      <div className="glass-card rounded-2xl p-5" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <h3 className="text-red-400 font-semibold text-sm mb-4">Danger Zone</h3>
        <div className="space-y-2.5">
          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/5"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            Remove This Website
          </button>
          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/5"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}