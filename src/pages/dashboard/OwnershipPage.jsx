import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle, Copy, AlertTriangle, Globe, ArrowRight, RefreshCw } from 'lucide-react';

export default function OwnershipPage() {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); setVerified(true); }, 1800);
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const dnsRecord = [
    { key: 'type', label: 'Type', value: 'TXT' },
    { key: 'name', label: 'Name', value: '_crozora.yourdomain.com', copyKey: 'name' },
    { key: 'value', label: 'Value', value: 'crozora_verify_xxxxxxxx', copyKey: 'value' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="text-blue-400 font-semibold">Step 2</span>
          <span>/ 4</span>
        </div>
        <h1 className="text-3xl font-bold font-space text-white">Verify Domain Ownership</h1>
        <p className="text-slate-400 text-sm mt-2">Add this DNS record to prove you control your website.</p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Success state */}
        {verified && (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Domain Ownership Confirmed</p>
              <p className="text-xs text-slate-400 mt-0.5">Your website is verified. You can now run the trust scan.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/scan')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
            >
              Run Scan <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* DNS record */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Globe size={16} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Add this TXT record to your DNS provider</h2>
              <p className="text-xs text-slate-500">Log in to your domain registrar and add the record below</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
            {dnsRecord.map(({ key, label, value, copyKey }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3" style={{
                borderBottom: key !== 'value' ? '1px solid rgba(59,130,246,0.08)' : 'none',
                background: 'rgba(5,11,24,0.6)'
              }}>
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs text-slate-500 w-12 flex-shrink-0">{label}</span>
                  <span className="text-sm font-mono text-white truncate">{value}</span>
                </div>
                {copyKey && (
                  <button
                    onClick={() => handleCopy(copyKey, value)}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1 rounded-lg flex-shrink-0 ml-3"
                    style={{ background: 'rgba(59,130,246,0.08)' }}
                  >
                    <Copy size={11} />
                    {copied === copyKey ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {!verified ? (
            <button
              onClick={handleCheck}
              disabled={checking}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
            >
              {checking ? <><RefreshCw size={14} className="animate-spin" /> Checking DNS…</> : 'Check Verification'}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircle size={15} /> DNS record detected — ownership confirmed
            </div>
          )}
        </div>

        {/* DNS tip */}
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>
            DNS changes can take a few minutes to several hours to propagate. If verification fails right after adding the record, wait an hour and try again.
          </p>
        </div>

        {/* Steps */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">How to add the DNS record</h3>
          <div className="space-y-3">
            {[
              'Log in to your domain registrar (e.g. GoDaddy, Namecheap, Google Domains)',
              'Go to DNS settings or zone management',
              'Add a new TXT record with the name and value shown above',
              'Save the record and wait for it to propagate',
              'Come back here and click "Check Verification"',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  {i + 1}
                </div>
                <p className="text-sm text-slate-400">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}