import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Globe, ScanLine, Award, Copy, CheckCircle,
  RefreshCw, AlertTriangle, Zap, ArrowRight, Lock, AlertCircle, Building2, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { createBusiness } from '@/services/businesses';
import { createWebsite } from '@/services/websites';
import { createSiteReport } from '@/services/reports';
import {
  buildVerificationRecord,
  checkDomainVerification,
  createDomainVerification,
  getLatestDomainVerification,
} from '@/services/domainVerification';
import {
  createTrustScan,
  runFreePreviewScan,
  updateTrustScan,
} from '@/services/trustScans';

// ─── Shell ────────────────────────────────────────────────────────────────────
function WizardShell({ step, children }) {
  const labels = ['Website', 'Business Info', 'DNS Verify', 'Preview Scan', 'Result'];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#050b18' }}>
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 70%)' }} />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
          <Shield size={16} className="text-white" />
        </div>
        <span className="text-white font-space font-bold text-xl tracking-tight">Crozora</span>
      </div>

      {/* Step dots */}
      {step > 0 && (
        <div className="flex items-center gap-0 mb-8 w-full max-w-xl">
          {labels.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            const last = i === labels.length - 1;
            return (
              <div key={label} className="flex items-center" style={{ flex: last ? '0 0 auto' : 1 }}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: done ? 'rgba(52,211,153,0.15)' : active ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'rgba(30,41,59,0.8)',
                      border: done ? '1px solid rgba(52,211,153,0.4)' : active ? 'none' : '1px solid rgba(71,85,105,0.5)',
                      color: done ? '#34d399' : active ? '#fff' : 'rgba(100,116,139,0.6)',
                      boxShadow: active ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                    }}>
                    {done ? <CheckCircle size={13} /> : s}
                  </div>
                  <span className="text-xs hidden sm:block whitespace-nowrap"
                    style={{ color: done ? '#34d399' : active ? '#93c5fd' : 'rgba(100,116,139,0.5)', fontSize: '10px' }}>
                    {label}
                  </span>
                </div>
                {!last && <div className="flex-1 h-px mx-2 mb-4" style={{ background: done ? 'rgba(52,211,153,0.25)' : 'rgba(59,130,246,0.1)' }} />}
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-lg relative z-10">{children}</div>
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ onNext }) {
  return (
    <WizardShell step={0}>
      <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.15))', border: '1px solid rgba(59,130,246,0.3)' }}>
          <Shield size={28} className="text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold font-space text-white mb-3">Welcome to Crozora</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          We'll guide you through your free trust preview, website ownership verification, and next steps toward a Crozora Verified Badge.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Globe, label: 'Verify website ownership', color: '#3b82f6' },
            { icon: ScanLine, label: 'Run trust preview', color: '#06b6d4' },
            { icon: Award, label: 'Choose verification path', color: '#10b981' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="rounded-xl p-4 flex flex-col items-center gap-2 text-center"
              style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs text-slate-400 leading-tight">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onNext}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}>
          Start Free Preview <ArrowRight size={15} />
        </button>
      </div>
    </WizardShell>
  );
}

// ─── Step 1: Enter Website ────────────────────────────────────────────────────
function StepWebsite({ onNext, data, setData }) {
  const [url, setUrl] = useState(data.url || '');
  const handleContinue = () => {
    const cleaned = url.trim().replace(/https?:\/\//, '').replace(/\/$/, '') || 'example.com';
    setData({ ...data, url: cleaned });
    onNext();
  };
  return (
    <WizardShell step={1}>
      <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">Step 1 of 6</p>
            <h2 className="text-xl font-bold font-space text-white">What website do you want to preview?</h2>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-6">Enter your business website. Crozora will normalize the URL automatically.</p>
        <div className="mb-6">
          <label className="text-xs text-slate-500 mb-2 block">Website URL</label>
          <input type="text" placeholder="example.com" value={url}
            onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleContinue()} autoFocus
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }} />
          <p className="text-xs text-slate-600 mt-2">You can enter example.com, www.example.com, http://example.com, or https://example.com.</p>
        </div>
        <button onClick={handleContinue}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </WizardShell>
  );
}

// ─── Step 2: Business Info ────────────────────────────────────────────────────
const CATEGORIES = ['Local Service Business', 'E-commerce', 'Professional Services', 'Education', 'Healthcare', 'Restaurant / Food', 'Technology', 'Other'];
const BUILDERS = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'GoDaddy', 'Webflow', 'Base44', 'Custom website', "Other / I don't know"];
const SERVICE_TYPES = ['Online only', 'In-person only', 'Both online and in-person'];

function StepBusinessInfo({ onNext, data, setData, isSaving, saveError }) {
  const [form, setForm] = useState({
    name: data.name || '', email: data.email || '', category: data.category || '',
    builder: data.builder || '', country: data.country || '', state: data.state || '',
    city: data.city || '', serviceType: data.serviceType || '',
    contactUrl: data.contactUrl || '', privacyUrl: data.privacyUrl || '',
    termsUrl: data.termsUrl || '', reviewUrl: data.reviewUrl || '',
  });
  const [showOptional, setShowOptional] = useState(false);

  const inputCls = 'w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40';
  const inputStyle = { background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' };
  const selStyle = (val) => ({ background: 'rgba(5,11,24,0.9)', border: '1px solid rgba(59,130,246,0.2)', color: val ? '#e2e8f0' : '#475569' });

  const handleContinue = () => {
    const nextData = { ...data, ...form };
    setData(nextData);
    onNext(nextData);
  };

  return (
    <WizardShell step={2}>
      <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">Step 2 of 6</p>
            <h2 className="text-xl font-bold font-space text-white">Tell us about the business</h2>
          </div>
        </div>

        {data.url && (
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <Globe size={12} className="text-blue-400 flex-shrink-0" />
            <span className="text-xs text-blue-300 font-mono">{data.url}</span>
          </div>
        )}

        <div className="space-y-3 mb-4">
          {[
            { label: 'Business Name', key: 'name', placeholder: 'Your business name' },
            { label: 'Business Email', key: 'email', placeholder: 'contact@yourbusiness.com', type: 'email' },
          ].map(({ label, key, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="text-xs text-slate-500 mb-1.5 block">{label}</label>
              <input type={type} placeholder={placeholder} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className={inputCls} style={inputStyle} />
            </div>
          ))}

          {[
            { label: 'Business Type / Category', key: 'category', options: CATEGORIES },
            { label: 'Website Builder', key: 'builder', options: BUILDERS },
            { label: 'Service Type', key: 'serviceType', options: SERVICE_TYPES },
          ].map(({ label, key, options }) => (
            <div key={key}>
              <label className="text-xs text-slate-500 mb-1.5 block">{label}</label>
              <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500/40"
                style={selStyle(form[key])}>
                <option value="">Select…</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Country', key: 'country', placeholder: 'US' },
              { label: 'State/Region', key: 'state', placeholder: 'CA' },
              { label: 'City', key: 'city', placeholder: 'Los Angeles' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1.5 block">{label}</label>
                <input type="text" placeholder={placeholder} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className={inputCls} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        {/* Optional section */}
        <button onClick={() => setShowOptional(v => !v)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-3 transition-colors">
          <ChevronRight size={12} className={`transition-transform ${showOptional ? 'rotate-90' : ''}`} />
          {showOptional ? 'Hide' : 'Add'} optional details (contact URL, privacy URL, etc.)
        </button>

        {showOptional && (
          <div className="space-y-3 mb-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.08)' }}>
            {[
              { label: 'Contact Page URL', key: 'contactUrl', placeholder: 'https://example.com/contact' },
              { label: 'Privacy Policy URL', key: 'privacyUrl', placeholder: 'https://example.com/privacy' },
              { label: 'Terms / Policy URL', key: 'termsUrl', placeholder: 'https://example.com/terms' },
              { label: 'Review Profile URL', key: 'reviewUrl', placeholder: 'https://g.page/your-business' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1.5 block">{label}</label>
                <input type="text" placeholder={placeholder} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className={inputCls} style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {saveError ? (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm text-red-100"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {saveError}
          </div>
        ) : null}

        <button onClick={handleContinue} disabled={isSaving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)', opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? <><RefreshCw size={15} className="animate-spin" /> Saving business details...</> : <>Continue <ArrowRight size={15} /></>}
        </button>
      </div>
    </WizardShell>
  );
}

// ─── Step 3: DNS ──────────────────────────────────────────────────────────────
function StepDNS({ onNext, data, verificationRecord, onVerify }) {
  const [verified, setVerified] = useState(data.ownershipVerified || false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(null);
  const [lookupMessage, setLookupMessage] = useState('');
  const [lookupError, setLookupError] = useState('');
  const domain = verificationRecord?.normalizedDomain || data.url || 'example.com';
  const dnsName = verificationRecord?.dns_name || verificationRecord?.dnsName || `_crozora.${domain}`;
  const dnsValue = verificationRecord?.expected_value || verificationRecord?.expectedValue || 'crozora_verify_xxxxx';

  const copy = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const check = async () => {
    if (!verificationRecord) {
      return;
    }

    setChecking(true);
    setLookupMessage('');
    setLookupError('');

    try {
      const result = await checkDomainVerification({
        verificationId: verificationRecord.id,
        websiteId: data.websiteId,
      });

      if (result.matched) {
        if (result?.verification && onVerify) {
          onVerify(result.verification);
        }
        setVerified(true);
        setLookupMessage('We found the TXT record. Your website ownership is now confirmed.');
      } else {
        setLookupMessage('We checked live DNS, but the record is not visible yet. DNS updates can take some time to appear.');
      }
    } catch (error) {
      setLookupError(error.message || 'We could not check DNS right now. Please try again in a moment.');
    } finally {
      setChecking(false);
    }
  };

  const rows = [
    { label: 'Type', value: 'TXT', key: 'type' },
    { label: 'Name', value: dnsName, key: 'name', copyable: true },
    { label: 'Value', value: dnsValue, key: 'value', copyable: true },
  ];
  return (
    <WizardShell step={3}>
      <div className="glass-card rounded-2xl p-8 space-y-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">Step 3 of 6</p>
            <h2 className="text-xl font-bold font-space text-white">Verify website ownership</h2>
          </div>
        </div>
        <p className="text-sm text-slate-400">Add this DNS TXT record to prove you control <span className="text-blue-300 font-mono">{domain}</span>.</p>
        <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
          <p className="text-sm text-slate-300 font-medium mb-2">Easy version:</p>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal pl-5">
            <li>Open the place where you bought your domain, like GoDaddy or Namecheap.</li>
            <li>Find the page called DNS, Domain Settings, or DNS Records.</li>
            <li>Add a new record and copy the Name and Value exactly as shown below.</li>
            <li>Save it, then come back here and click <span className="text-white font-medium">Check Verification</span>.</li>
          </ol>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.18)' }}>
          {rows.map(({ label, value, key, copyable }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(5,11,24,0.8)', borderBottom: key !== 'value' ? '1px solid rgba(59,130,246,0.08)' : 'none' }}>
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="text-xs text-slate-500 w-10 flex-shrink-0 font-medium">{label}</span>
                <span className="text-sm font-mono text-white truncate">{value}</span>
              </div>
              {copyable && (
                <button onClick={() => copy(key, value)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg ml-3 flex-shrink-0 transition-all"
                  style={{ background: 'rgba(59,130,246,0.1)', color: copied === key ? '#34d399' : '#60a5fa' }}>
                  {copied === key ? <><CheckCircle size={10} /> Copied</> : <><Copy size={10} /> Copy {label}</>}
                </button>
              )}
            </div>
          ))}
        </div>
        {verified ? (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Ownership verified</p>
              <p className="text-xs text-slate-400 mt-0.5">DNS record detected for <span className="font-mono">{domain}</span></p>
            </div>
          </div>
        ) : (
          <button onClick={check} disabled={checking || !verificationRecord}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
            {checking ? <><RefreshCw size={14} className="animate-spin" /> Checking live DNS...</> : 'Check Verification'}
          </button>
        )}
        {lookupMessage ? (
          <div className="rounded-xl px-4 py-3 text-sm text-slate-200"
            style={{ background: verified ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.06)', border: `1px solid ${verified ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.16)'}` }}>
            {lookupMessage}
          </div>
        ) : null}
        {lookupError ? (
          <div className="rounded-xl px-4 py-3 text-sm text-red-100"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
            {lookupError}
          </div>
        ) : null}
        <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">DNS changes may take a few minutes to several hours to appear.</p>
        </div>
        {verified && (
          <button onClick={onNext}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
            Continue to Trust Preview <ArrowRight size={15} />
          </button>
        )}
      </div>
    </WizardShell>
  );
}

// ─── Step 4: Trust Preview Scan ───────────────────────────────────────────────
const SCAN_ITEMS = ['Website accessibility', 'HTTPS / security signals', 'Contact information', 'Business policies', 'Visible reputation signals', 'Scam-risk indicators'];

function StepScan({ onNext, data }) {
  const [phase, setPhase] = useState('idle');
  const [completed, setCompleted] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanError, setScanError] = useState('');

  const start = async () => {
    if (!data.websiteId || !data.businessId) {
      setScanError('Please finish the website setup first.');
      return;
    }

    setScanError('');
    setPhase('scanning'); setCompleted([]);
    setProgress(0);

    try {
      const scan = await createTrustScan({
        websiteId: data.websiteId,
        ownerId: data.userId,
        scanType: 'free_preview',
        status: 'running',
        rawScanData: {
          domain: data.url,
          businessName: data.name,
        },
      });

      const animationPromise = new Promise((resolve) => {
        SCAN_ITEMS.forEach((_, i) => {
          setTimeout(() => {
            setCompleted((prev) => [...prev, i]);
            setProgress(Math.round(((i + 1) / SCAN_ITEMS.length) * 100));
            if (i === SCAN_ITEMS.length - 1) {
              resolve();
            }
          }, (i + 1) * 600);
        });
      });

      const scanPromise = runFreePreviewScan({
        websiteId: data.websiteId,
        websiteUrl: `https://${data.url}`,
        domain: data.url,
        businessName: data.name,
        businessEmail: data.email,
        category: data.category,
        serviceType: data.serviceType,
        country: data.country,
        stateRegion: data.state,
        city: data.city,
        contactUrl: data.contactUrl,
        privacyUrl: data.privacyUrl,
        termsUrl: data.termsUrl,
        reviewUrl: data.reviewUrl,
        ownershipVerified: data.ownershipVerified,
      });

      const [artifacts] = await Promise.all([scanPromise, animationPromise]);

      const completedScan = await updateTrustScan(scan.id, {
        status: 'completed',
        overall_status: artifacts.overallStatus,
        findings: artifacts.findings,
        raw_scan_data: artifacts.rawScanData || {
          domain: data.url,
          businessName: data.name,
        },
        completed_at: new Date().toISOString(),
      });

      const report = await createSiteReport({
        websiteId: data.websiteId,
        ownerId: data.userId,
        ...artifacts.report,
      });

      const nextData = {
        ...data,
        previewResult: completedScan.overall_status,
        previewStatus: 'complete',
        latestScanId: completedScan.id,
        latestReportId: report.id,
      };

      sessionStorage.setItem('crozora_biz', JSON.stringify(nextData));
      onNext(nextData);
      setPhase('done');
    } catch (error) {
      setPhase('idle');
      setScanError(error.message || 'We could not start the preview scan.');
    }
  };
  return (
    <WizardShell step={4}>
      <div className="glass-card rounded-2xl p-8 space-y-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <ScanLine size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">Step 4 of 6</p>
            <h2 className="text-xl font-bold font-space text-white">Run your trust preview</h2>
          </div>
        </div>
        <p className="text-sm text-slate-400">Crozora will review visible trust signals for <span className="text-blue-300 font-mono">{data.url || 'your website'}</span>.</p>
        {phase !== 'idle' && (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: phase === 'done' ? '#34d399' : 'rgba(148,163,184,0.6)' }}>{phase === 'done' ? '✓ Preview complete' : 'Scanning…'}</span>
              <span className="text-blue-400 font-mono font-bold">{progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <div className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: phase === 'done' ? 'linear-gradient(90deg, #3b82f6, #34d399)' : 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
            </div>
          </div>
        )}
        <div className="space-y-2">
          {SCAN_ITEMS.map((item, i) => {
            const done = completed.includes(i);
            const active = phase === 'scanning' && completed.length === i;
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
                style={{ background: done ? 'rgba(16,185,129,0.05)' : 'rgba(59,130,246,0.03)', border: `1px solid ${done ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.08)'}` }}>
                {done ? <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  : active ? <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ border: '1px solid rgba(71,85,105,0.5)' }} />}
                <span className={`text-sm transition-colors duration-300 ${done ? 'text-slate-300' : active ? 'text-slate-400' : 'text-slate-600'}`}>{item}</span>
              </div>
            );
          })}
        </div>
        {phase === 'idle' && (
          <button onClick={start}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
            <Zap size={15} /> Start Preview Scan
          </button>
        )}
        {scanError ? (
          <div className="rounded-xl px-4 py-3 text-sm text-red-100"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
            {scanError}
          </div>
        ) : null}
      </div>
    </WizardShell>
  );
}

// ─── Step 5: Free Preview Result ──────────────────────────────────────────────
const PREVIEW_RESULTS = {
  passed: {
    label: 'Your website shows strong trust signals',
    color: '#34d399', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)',
    icon: CheckCircle, iconColor: 'text-emerald-400',
    msg: "Crozora's free preview found early trust signals for this website. To activate a Crozora Verified Badge and public trust page, choose one-time verification for this site or start Crozora Pro.",
    primaryBtn: 'Continue to Free Dashboard',
    secondaryBtn: 'Activate Badge Options',
    previewResult: 'passed',
  },
  failed: {
    label: 'Your website needs more work before verification',
    color: '#fbbf24', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)',
    icon: AlertTriangle, iconColor: 'text-amber-400',
    msg: "Crozora's free preview did not find enough trust signals to continue toward a badge yet. Upgrade to see what needs attention and how to improve this website.",
    primaryBtn: 'Go to Free Dashboard',
    secondaryBtn: 'Unlock More Details',
    previewResult: 'failed',
  },
  review: {
    label: 'This website needs closer review',
    color: '#f87171', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)',
    icon: AlertCircle, iconColor: 'text-red-400',
    msg: 'Crozora needs more information before determining whether this website can receive a verified badge. Upgrade to continue with a deeper review.',
    primaryBtn: 'Go to Free Dashboard',
    secondaryBtn: 'Continue Review',
    previewResult: 'review',
  },
};

function StepResult({ onDone, data }) {
  const [showModal, setShowModal] = useState(false);
  const statusMap = {
    looks_promising: 'passed',
    needs_improvement: 'failed',
    needs_closer_review: 'review',
  };
  const active = statusMap[data.previewResult] || 'passed';
  const r = PREVIEW_RESULTS[active];
  const ResultIcon = r.icon;
  const name = data.name || data.url || 'Your Business';
  const domain = data.url || 'example.com';

  const goToDashboard = (result) => {
    sessionStorage.setItem('crozora_biz', JSON.stringify({ ...data, plan: 'free', previewResult: result }));
    onDone();
  };

  return (
    <WizardShell step={5}>
      {showModal && <PlanModal onClose={() => setShowModal(false)} domain={domain} />}
      <div className="glass-card rounded-2xl p-8 space-y-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <ScanLine size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">Free Preview Complete</p>
            <h2 className="text-xl font-bold font-space text-white">Your trust preview is ready</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
          <Building2 size={12} className="text-blue-400" />
          <span className="text-xs text-slate-400">{name}</span>
          {domain && <><span className="text-xs text-slate-600 mx-1">·</span><span className="text-xs font-mono text-blue-300">{domain}</span></>}
        </div>

        {/* Result card */}
        <div className="rounded-xl p-5" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
          <div className="flex items-start gap-3 mb-3">
            <ResultIcon size={20} style={{ color: r.color }} className="flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-base text-white leading-tight">{r.label}</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{r.msg}</p>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
          <Lock size={12} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">This is a limited preview only. Detailed findings and badge eligibility require a paid plan.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => goToDashboard(r.previewResult)}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
            {r.primaryBtn} <ArrowRight size={15} />
          </button>
          <button onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.8)' }}>
            {r.secondaryBtn}
          </button>
        </div>
      </div>
    </WizardShell>
  );
}

// ─── Plan Upgrade Modal ───────────────────────────────────────────────────────
function PlanModal({ onClose, domain }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-5"
        style={{ border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 60px rgba(59,130,246,0.15)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-space text-white">Verification Options</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-slate-400">Choose how you want to continue with <span className="text-blue-300 font-mono">{domain}</span>.</p>
        <div className="space-y-3">
          <div className="p-5 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold font-space text-white">$30</span>
              <span className="text-slate-500 text-sm">one-time</span>
              <span className="text-sm font-semibold text-white ml-1">One-Time Site Verification</span>
            </div>
            <p className="text-xs text-slate-400">Covers this website only. Badge access if approved, advanced report, public trust page if approved.</p>
          </div>
          <div className="p-5 rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold font-space text-white">$20</span>
              <span className="text-slate-500 text-sm">/month</span>
              <span className="text-sm font-semibold text-white ml-1">Crozora Pro</span>
            </div>
            <p className="text-xs text-slate-400">Multiple websites, advanced reports, ongoing rechecks, badge monitoring, and install support.</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 text-center">Payment does not guarantee badge approval. Websites must pass verification.</p>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => /** @type {Record<string, any>} */ ({}));
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [verificationRecord, setVerificationRecord] = useState(null);
  const next = () => setStep(s => s + 1);
  const finish = () => navigate('/dashboard/home');

  useEffect(() => {
    let active = true;

    if (!user) {
      return;
    }

    const restoreSavedState = async () => {
      try {
        const saved = sessionStorage.getItem('crozora_biz');
        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved);
        if (!active) {
          return;
        }

        setData(prev => ({ ...parsed, ...prev }));

        if (!parsed?.websiteId) {
          return;
        }

        const latestVerification = await getLatestDomainVerification(parsed.websiteId).catch(() => null);
        if (!latestVerification || !active) {
          return;
        }

        const normalizedDomain = parsed.normalizedDomain
          || parsed.url
          || latestVerification.dns_name?.replace(/^_crozora\./, '')
          || 'example.com';

        setVerificationRecord({
          ...latestVerification,
          normalizedDomain,
          dnsName: latestVerification.dns_name,
          expectedValue: latestVerification.expected_value,
        });
      } catch {
        // keep onboarding resilient if legacy session data is malformed
      }
    };

    restoreSavedState();

    return () => {
      active = false;
    };
  }, [user]);

  const persistBusinessAndWebsite = async (nextData) => {
    if (!user) {
      throw new Error('Please sign in again before continuing.');
    }

    if (nextData.businessId && nextData.websiteId) {
      const existingVerification = await getLatestDomainVerification(nextData.websiteId).catch(() => null);

      if (existingVerification) {
        const persistedExisting = {
          ...nextData,
          ownershipVerificationId: existingVerification.id,
          normalizedDomain: nextData.normalizedDomain || nextData.url,
        };

        sessionStorage.setItem('crozora_biz', JSON.stringify(persistedExisting));
        setVerificationRecord({
          ...existingVerification,
          normalizedDomain: persistedExisting.normalizedDomain,
          dnsName: existingVerification.dns_name,
          expectedValue: existingVerification.expected_value,
        });
        setData(persistedExisting);
        return;
      }
    }

    const serviceTypeMap = {
      'Online only': 'online',
      'In-person only': 'in_person',
      'Both online and in-person': 'both',
    };

    const verificationDraft = buildVerificationRecord(nextData.url);

    const business = await createBusiness({
      ownerId: user.id,
      businessName: nextData.name || verificationDraft.normalizedDomain,
      businessEmail: nextData.email,
      category: nextData.category,
      serviceType: serviceTypeMap[nextData.serviceType] || 'online',
      country: nextData.country,
      stateRegion: nextData.state,
      city: nextData.city,
    });

    const website = await createWebsite({
      ownerId: user.id,
      businessId: business.id,
      rawUrl: nextData.url,
      websiteBuilder: nextData.builder,
      contactPageUrl: nextData.contactUrl,
      privacyPolicyUrl: nextData.privacyUrl,
      termsPolicyUrl: nextData.termsUrl,
      reviewProfileUrl: nextData.reviewUrl,
      ownershipStatus: 'pending',
      previewStatus: 'not_started',
      verificationStatus: 'not_started',
      badgeStatus: 'unavailable',
      publicPageStatus: 'inactive',
      planCoverage: 'free',
    });

    const verification = await createDomainVerification({
      ownerId: user.id,
      websiteId: website.id,
      rawUrl: nextData.url,
      record: verificationDraft,
    });

    const persisted = {
      ...nextData,
      businessId: business.id,
      websiteId: website.id,
      ownershipVerificationId: verification.id,
      ownershipVerified: false,
      normalizedDomain: website.normalized_domain,
    };

    sessionStorage.setItem('crozora_biz', JSON.stringify(persisted));
    setVerificationRecord({
      ...verification,
      normalizedDomain: website.normalized_domain,
      dnsName: verification.dns_name,
      expectedValue: verification.expected_value,
    });
    setData(persisted);
  };

  const handleBusinessNext = async (nextData) => {
    try {
      setIsSavingBusiness(true);
      setSaveError('');
      await persistBusinessAndWebsite(nextData);
      next();
    } catch (error) {
      setSaveError(error.message || 'We could not save your website details yet.');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleOwnershipVerified = (latestVerification = null) => {
    const nextData = {
      ...data,
      ownershipVerified: true,
    };

    sessionStorage.setItem('crozora_biz', JSON.stringify(nextData));
    setData(nextData);

    if (latestVerification) {
      setVerificationRecord((previous) => ({
        ...(previous || {}),
        ...latestVerification,
        dnsName: latestVerification.dns_name || latestVerification.dnsName,
        expectedValue: latestVerification.expected_value || latestVerification.expectedValue,
      }));
    }
  };

  if (step === 0) return <StepWelcome onNext={next} />;
  if (step === 1) return <StepWebsite onNext={next} data={data} setData={setData} />;
  if (step === 2) return <StepBusinessInfo onNext={handleBusinessNext} data={data} setData={setData} isSaving={isSavingBusiness} saveError={saveError} />;
  if (step === 3) return <StepDNS onNext={next} data={data} verificationRecord={verificationRecord} onVerify={handleOwnershipVerified} />;
  if (step === 4) return <StepScan onNext={(nextData) => { setData(nextData); next(); }} data={{ ...data, userId: user?.id }} />;
  if (step === 5) return <StepResult onDone={finish} data={data} />;
  return null;
}
