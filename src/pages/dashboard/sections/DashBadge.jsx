import { useState } from 'react';
import { Shield, Award, AlertCircle, HelpCircle, CheckCircle, Copy } from 'lucide-react';

const PLATFORMS = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'GoDaddy', 'Webflow', 'Base44', 'Custom HTML', "Other / I don't know"];
const PLATFORM_STEPS = {
  'Wix':         ['Open Wix Editor', 'Click Add → More → HTML Embed', 'Paste the script code', 'Position the badge on your page', 'Publish'],
  'WordPress':   ['Log in to wp-admin', 'Go to Appearance → "Insert Headers and Footers"', 'Paste the script before </body>', 'Save and clear cache'],
  'Shopify':     ['Online Store → Themes → Edit Code', 'Open theme.liquid', 'Paste script before </body>', 'Save and preview'],
  'Squarespace': ['Edit your page', 'Add a Code Block', 'Paste the badge code', 'Apply and publish'],
  'Webflow':     ['Open Project Settings → Custom Code', 'Paste script in Footer Code section', 'Save and Publish'],
  'GoDaddy':     ['Open Website Builder', 'Add an HTML element', 'Paste the badge code', 'Save and publish'],
  'Base44':      ['Open your page in Base44 editor', 'Add an HTML component', 'Paste the badge script', 'Publish your app'],
  'Custom HTML': ['Open your HTML file', 'Paste the script before </body>', 'Save and deploy'],
};

function BadgePreview({ bizId }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2444 100%)', border: '1px solid rgba(59,130,246,0.4)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
        <Shield size={12} className="text-white" />
      </div>
      <div>
        <div className="text-sm font-bold text-white leading-tight">Crozora Verified</div>
        <div style={{ color: '#34d399', fontSize: '10px' }}>✓ Trust Checked · Active</div>
      </div>
    </div>
  );
}

function CodeBlock({ label, code, copied, onCopy }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <button onClick={onCopy} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors"
          style={{ background: 'rgba(59,130,246,0.08)', color: copied ? '#34d399' : '#60a5fa' }}>
          {copied ? <><CheckCircle size={10} /> Copied!</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
      <div className="rounded-lg p-3 font-mono text-xs overflow-x-auto whitespace-pre"
        style={{ background: '#030712', border: '1px solid rgba(59,130,246,0.1)', color: '#93c5fd' }}>{code}</div>
    </div>
  );
}

function BadgeInstaller({ biz, isOnetime }) {
  const domain = biz.url || 'tuneteachers.com';
  const bizId = domain.replace(/\./g, '-');
  const [platform, setPlatform] = useState(biz.builder || null);
  const [copied, setCopied] = useState(null);

  const scriptCode = `<script src="https://crozora.com/badge.js" data-business-id="${bizId}"></script>`;
  const imageCode = `<a href="https://crozora.com/verify/${bizId}" target="_blank">\n  <img src="https://crozora.com/badge/${bizId}.svg" alt="Crozora Verified Badge">\n</a>`;
  const copy = (key, text) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); };
  const steps = PLATFORM_STEPS[platform] || null;

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">
          {isOnetime ? `Install Badge for ${domain}` : 'Manage Verified Badges'}
        </h1>
        {isOnetime && <p className="text-xs text-amber-400 mt-1">This badge applies only to <span className="font-mono">{domain}</span>.</p>}
      </div>

      {/* Badge preview */}
      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <BadgePreview bizId={bizId} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-semibold text-sm">Badge Status:</p>
            <span className="text-xs status-active px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-xs text-slate-400">Public page: <span className="font-mono text-blue-300">crozora.com/verify/{bizId}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Last checked: April 2026 · Next: May 2026</p>
        </div>
      </div>

      {/* Platform selector */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-white font-semibold text-sm mb-0.5">How was your website built?</h3>
          {biz.builder && <p className="text-xs text-slate-500">Pre-selected based on your setup: <span className="text-blue-300">{biz.builder}</span></p>}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className="py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-all"
              style={{
                background: platform === p ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.04)',
                border: platform === p ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                color: platform === p ? '#60a5fa' : 'rgba(148,163,184,0.5)',
              }}>{p}</button>
          ))}
        </div>
        {platform === "Other / I don't know" ? (
          <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
            <HelpCircle size={22} className="text-blue-400 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm mb-1">No problem. Crozora can help you install it.</p>
            <p className="text-xs text-slate-500 mb-4">Our team will walk you through the installation.</p>
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Request Badge Setup Help
            </button>
          </div>
        ) : steps ? (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
            <p className="text-sm font-semibold text-white mb-3">{platform} — Installation Steps</p>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-xs font-bold text-blue-400 mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                  <span className="text-sm text-slate-300">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>

      {/* Code */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h3 className="text-white font-semibold text-sm">Badge Code Options</h3>
        <CodeBlock label="Script Badge (recommended)" code={scriptCode} copied={copied === 'script'} onCopy={() => copy('script', scriptCode)} />
        <CodeBlock label="Image Link Badge" code={imageCode} copied={copied === 'image'} onCopy={() => copy('image', imageCode)} />
      </div>
    </div>
  );
}

export default function DashBadge({ biz, status, setSection }) {
  const domain = biz.url || 'tuneteachers.com';
  const isApproved = status === 'approved';
  const isPro = status === 'pro';
  const isOnetime = status === 'onetime';

  if (status === 'free') {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Badge Setup</h1>
        <div className="glass-card rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <Award size={24} className="text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-white font-space mb-3">Badge Not Available on Free Preview</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto text-slate-400">
            Free previews do not include badge access. Choose one-time verification for this website or start Crozora Pro to continue toward a badge.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Verify This Website — $30
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

  if (status === 'not_approved' || (isOnetime && !isApproved) || (isPro && !isApproved)) {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Badge Setup</h1>
        <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertCircle size={28} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white font-space mb-3">Badge Not Approved Yet</h2>
          <p className="text-sm mb-6 text-slate-400 max-w-sm mx-auto">
            This website must pass Crozora verification before a badge can be activated. Review the site report and fix the recommended items before requesting a recheck.
          </p>
          <button onClick={() => setSection('report')} className="px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
            View Site Report
          </button>
        </div>
      </div>
    );
  }

  // approved or pro with approval
  return <BadgeInstaller biz={biz} isOnetime={!isPro} />;
}