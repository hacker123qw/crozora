import { useMemo, useState } from 'react';
import { Shield, Award, AlertCircle, HelpCircle, CheckCircle, Copy, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { buildPublicSiteUrl, getPublicSiteUrl } from '@/lib/site-url';
import { ensureBadgeForWebsite } from '@/services/badges';
import { updateWebsiteById } from '@/services/websites';

const PLATFORMS = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'GoDaddy', 'Webflow', 'Custom HTML', "Other / I don't know"];

const PLATFORM_STEPS = {
  Wix: ['Open your Wix editor', 'Add an HTML Embed block', 'Paste the script badge code', 'Place the badge where customers will see it', 'Publish your site'],
  WordPress: ['Open your WordPress dashboard', 'Add a Custom HTML block or footer code area', 'Paste the script badge code', 'Save your changes', 'Refresh your live website'],
  Shopify: ['Open Shopify admin', 'Go to Online Store > Themes > Customize', 'Add a custom liquid block or edit theme code', 'Paste the script badge code', 'Save and preview'],
  Squarespace: ['Open the page editor', 'Insert a Code Block', 'Paste the script badge code', 'Apply changes', 'Publish the site'],
  Webflow: ['Open your Webflow designer', 'Add an Embed element', 'Paste the script badge code', 'Publish your project'],
  GoDaddy: ['Open your site editor', 'Add an HTML or custom code section', 'Paste the script badge code', 'Save', 'Publish the site'],
  'Custom HTML': ['Open the HTML template for your website', 'Paste the script badge code where you want the badge to appear', 'Save the file', 'Deploy or upload the update', 'Check the live page'],
};

function formatDate(value, fallback = 'Not available') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function BadgePreview({ status }) {
  const isActive = status === 'active';

  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2444 100%)',
        border: `1px solid ${isActive ? 'rgba(59,130,246,0.4)' : 'rgba(148,163,184,0.25)'}`,
        boxShadow: '0 0 20px rgba(59,130,246,0.15)',
      }}
    >
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
        <Shield size={12} className="text-white" />
      </div>
      <div>
        <div className="text-sm font-bold text-white leading-tight">Crozora Verified</div>
        <div className="text-[10px]" style={{ color: isActive ? '#34d399' : '#94a3b8' }}>
          {isActive ? 'Live verification badge' : 'Badge inactive'}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ label, code, copied, onCopy }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors"
          style={{ background: 'rgba(59,130,246,0.08)', color: copied ? '#34d399' : '#60a5fa' }}
        >
          {copied ? <><CheckCircle size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
      <div
        className="rounded-lg p-3 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all"
        style={{ background: '#030712', border: '1px solid rgba(59,130,246,0.1)', color: '#93c5fd' }}
      >
        {code}
      </div>
    </div>
  );
}

function HelpPanel() {
  return (
    <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
      <HelpCircle size={22} className="text-blue-400 mx-auto mb-2" />
      <p className="text-white font-semibold text-sm mb-1">Not sure how your site was built?</p>
      <p className="text-xs text-slate-500 mb-4">That is okay. Start with the script option first. If it does not appear, Crozora support can help you place it correctly.</p>
      <a
        href="mailto:support@crozora.com?subject=Crozora%20Badge%20Install%20Help"
        className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
      >
        Email support@crozora.com
      </a>
    </div>
  );
}

function BadgeInstaller({ biz, badge }) {
  const [platform, setPlatform] = useState(biz.builder || null);
  const [copied, setCopied] = useState(null);

  const siteUrl = getPublicSiteUrl();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const publicVerifyUrl = buildPublicSiteUrl(`/verify/${badge.public_slug}`);
  const badgeScriptUrl = buildPublicSiteUrl('/badge.js');
  const badgeImageUrl = `${supabaseUrl}/functions/v1/badge-svg?slug=${encodeURIComponent(badge.public_slug)}`;
  const scriptCode = `<script src="${badgeScriptUrl}" data-public-slug="${badge.public_slug}" data-badge-token="${badge.badge_token}" data-site-url="${siteUrl}" data-supabase-url="${supabaseUrl}" data-supabase-anon-key="${supabaseAnonKey}"></script>`;
  const imageCode = `<a href="${publicVerifyUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${badgeImageUrl}" alt="Crozora Verified Badge">\n</a>`;
  const steps = PLATFORM_STEPS[platform] || null;
  const badgeStatus = badge.status === 'active' ? 'Active' : badge.status;

  const copy = async (key, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Install Your Badge</h1>
        <p className="text-sm text-slate-400 mt-2">This badge is linked to your public Crozora verification page. When customers click it, they can confirm the website is currently verified.</p>
      </div>

      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <BadgePreview status={badge.status} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">Badge status:</p>
            <span className="text-xs status-active px-2 py-0.5 rounded-full">{badgeStatus}</span>
          </div>
          <p className="text-xs text-slate-400">Public page: <span className="font-mono text-blue-300">{publicVerifyUrl}</span></p>
          <p className="text-xs text-slate-500">Last checked: {formatDate(biz.lastCheckedAt || badge.last_checked_at)}</p>
        </div>
        <a
          href={publicVerifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(59,130,246,0.24)' }}
        >
          Preview live page <ExternalLink size={14} />
        </a>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-white font-semibold text-sm mb-0.5">How was your website built?</h3>
          <p className="text-xs text-slate-500">Choose the option that feels closest. The steps are written for non-technical users too.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORMS.map((item) => (
            <button
              key={item}
              onClick={() => setPlatform(item)}
              className="py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-all"
              style={{
                background: platform === item ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.04)',
                border: platform === item ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                color: platform === item ? '#60a5fa' : 'rgba(148,163,184,0.7)',
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {platform === "Other / I don't know" ? <HelpPanel /> : steps ? (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
            <p className="text-sm font-semibold text-white mb-3">{platform} install steps</p>
            <ol className="space-y-2">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-2.5">
                  <span className="text-xs font-bold text-blue-400 mt-0.5 w-4 flex-shrink-0">{index + 1}.</span>
                  <span className="text-sm text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-white font-semibold text-sm">Badge Code Options</h3>
        <CodeBlock label="Script Badge (recommended)" code={scriptCode} copied={copied === 'script'} onCopy={() => copy('script', scriptCode)} />
        <CodeBlock label="Image Fallback Badge" code={imageCode} copied={copied === 'image'} onCopy={() => copy('image', imageCode)} />
      </div>
    </div>
  );
}

function BadgeProvisioner({ biz, onComplete }) {
  const { user } = useAuth();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [error, setError] = useState('');

  const handleProvision = async () => {
    if (!biz.websiteId || !user?.id) {
      setError('Please sign in again before preparing your badge.');
      return;
    }

    setIsProvisioning(true);
    setError('');

    try {
      const now = new Date().toISOString();
      const badge = await ensureBadgeForWebsite({
        websiteId: biz.websiteId,
        ownerId: user.id,
        normalizedDomain: biz.url,
        publicSlugBase: biz.url,
        status: 'active',
        issuedAt: now,
        lastCheckedAt: now,
      });

      await updateWebsiteById(biz.websiteId, {
        badge_status: 'active',
        public_page_status: 'active',
        last_checked_at: now,
      }, { operation: 'badge_activation' });

      const updatedBiz = {
        ...biz,
        latestBadge: badge,
        badgeStatus: 'active',
        publicPageStatus: 'active',
        lastCheckedAt: now,
      };

      sessionStorage.setItem('crozora_biz', JSON.stringify(updatedBiz));
      window.dispatchEvent(new Event('crozora-biz-refresh'));
      onComplete(updatedBiz);
    } catch (nextError) {
      setError(nextError.message || 'We could not prepare your badge yet.');
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold font-space text-white mb-6">Badge Setup</h1>
      <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(59,130,246,0.16)' }}>
        <Award size={28} className="text-blue-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white font-space mb-3">Prepare your live badge</h2>
        <p className="text-sm mb-6 text-slate-400 max-w-sm mx-auto">
          This website is already approved. Crozora just needs to create the live badge record and public verification page before you install it.
        </p>
        {error ? (
          <div className="rounded-xl px-4 py-3 text-sm text-red-100 mb-4" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
            {error}
          </div>
        ) : null}
        <button
          onClick={handleProvision}
          disabled={isProvisioning}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', opacity: isProvisioning ? 0.75 : 1 }}
        >
          {isProvisioning ? <><Loader2 size={16} className="animate-spin" /> Preparing badge</> : 'Create Live Badge'}
        </button>
      </div>
    </div>
  );
}

export default function DashBadge({ biz, status, setSection }) {
  const [localBiz, setLocalBiz] = useState(biz);
  const currentBiz = useMemo(() => ({ ...biz, ...localBiz }), [biz, localBiz]);
  const isApproved = currentBiz.verificationStatus === 'approved' || status === 'approved';
  const badge = currentBiz.latestBadge;

  if (status === 'free') {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Badge Setup</h1>
        <div className="glass-card rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <Award size={24} className="text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-white font-space mb-3">Badge not available on the free plan</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto text-slate-400">
            Free previews are meant to give you an early read. A live badge only becomes available after a paid verification and approval.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Verify this website - $30
            </button>
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.7)' }}>
              Start Crozora Pro - $20/month
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Badge Setup</h1>
        <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertCircle size={28} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white font-space mb-3">Badge not approved yet</h2>
          <p className="text-sm mb-6 text-slate-400 max-w-sm mx-auto">
            This website still needs to pass Crozora verification before a badge can go live. Review the report, make improvements, and request a recheck when you are ready.
          </p>
          <button onClick={() => setSection('report')} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
            View Site Report
          </button>
        </div>
      </div>
    );
  }

  if (!badge) {
    return <BadgeProvisioner biz={currentBiz} onComplete={setLocalBiz} />;
  }

  return <BadgeInstaller biz={currentBiz} badge={badge} />;
}
