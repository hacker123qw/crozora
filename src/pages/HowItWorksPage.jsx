import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { CheckCircle, Globe, Search, Lock, Award, ChevronRight, Copy, Loader } from 'lucide-react';

const platforms = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'GoDaddy', 'Webflow', 'Base44', 'Custom HTML', "Other / I don't know"];

const scanItems = [
  'Checking website security',
  'Reviewing contact signals',
  'Looking for business policies',
  'Checking reputation patterns',
  'Reviewing scam-risk indicators',
];

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const [dnsVerified, setDnsVerified] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleDnsCheck = () => {
    setTimeout(() => setDnsVerified(true), 1200);
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />

      <div className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              Full Process Overview
            </div>
            <h1 className="text-5xl font-space font-bold text-white mb-4">How Crozora Works</h1>
            <p className="text-lg" style={{ color: 'rgba(148,163,184,0.7)' }}>
              From your first scan to a live public verification badge — here's the full process.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-space text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>1</div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space">Submit your business</h2>
                  <p className="text-sm text-slate-500">Tell us about your business and website</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Business name', 'Website URL', 'Business email', 'Category', 'Service area'].map(field => (
                  <div key={field}>
                    <label className="text-xs text-slate-500 mb-1 block">{field}</label>
                    <div className="rounded-lg px-3 py-2.5 text-sm text-slate-500" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
                      {field === 'Business name' ? 'TuneTeachers' : field === 'Website URL' ? 'tuneteachers.com' : `Enter ${field.toLowerCase()}...`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-space text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>2</div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space">Verify website ownership</h2>
                  <p className="text-sm text-slate-500">Add a DNS TXT record to confirm you control the domain</p>
                </div>
              </div>

              <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <p className="text-sm text-slate-400 mb-4">Add this TXT record to your DNS provider:</p>
                <div className="space-y-3">
                  {[
                    { key: 'Type', val: 'TXT' },
                    { key: 'Name', val: '_crozora.example.com', copyKey: 'name' },
                    { key: 'Value', val: 'crozora_verify_abc123xyz', copyKey: 'value' },
                  ].map(({ key, val, copyKey }) => (
                    <div key={key} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ background: 'rgba(5,11,24,0.6)' }}>
                      <div>
                        <span className="text-xs text-slate-500 mr-3">{key}</span>
                        <span className="text-sm font-mono text-white">{val}</span>
                      </div>
                      {copyKey && (
                        <button onClick={() => handleCopy(copyKey, val)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <Copy size={12} />
                          {copied === copyKey ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!dnsVerified ? (
                <button onClick={handleDnsCheck} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                  Check Verification
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg w-fit" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">Ownership verified</span>
                </div>
              )}

              <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p className="text-xs text-amber-400">⏱ DNS changes may take a few minutes to several hours to appear.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-space text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>3</div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space">Run trust scan</h2>
                  <p className="text-sm text-slate-500">Automated analysis of your website trust signals</p>
                </div>
              </div>
              <div className="space-y-3">
                {scanItems.map((item, i) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                    <span className="ml-auto text-xs text-emerald-400 font-medium">Complete</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-space text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>4</div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space">Unlock report</h2>
                  <p className="text-sm text-slate-500">Free scan shows pass/fail — full details require a paid report</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">Free Result</p>
                  {['Pass', 'Fail', 'Needs Review'].map(r => (
                    <div key={r} className="flex items-center gap-2 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-sm text-slate-300">{r}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs text-emerald-400 font-semibold mb-2 uppercase tracking-wide">Paid Report</p>
                  {['Full score breakdown', 'Failed check details', 'Improvement steps', 'Badge eligibility'].map(r => (
                    <div key={r} className="flex items-center gap-2 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-slate-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-space text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>5</div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space">Display your badge</h2>
                  <p className="text-sm text-slate-500">Install on your platform of choice</p>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className="py-2.5 px-3 rounded-lg text-xs font-medium text-center transition-all"
                    style={{
                      background: selectedPlatform === p ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.05)',
                      border: selectedPlatform === p ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                      color: selectedPlatform === p ? '#60a5fa' : 'rgba(148,163,184,0.8)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {selectedPlatform && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  {selectedPlatform === "Other / I don't know" ? (
                    <div className="text-center py-4">
                      <p className="text-white font-semibold mb-2">No problem. Crozora can help you install it.</p>
                      <button className="mt-3 px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                        Request Installation Help
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-white mb-3">{selectedPlatform} Installation</p>
                      <p className="text-sm text-slate-400">Follow these steps to add your badge to {selectedPlatform}:</p>
                      <ol className="mt-3 space-y-2">
                        <li className="text-sm text-slate-300">1. Log in to your {selectedPlatform} dashboard</li>
                        <li className="text-sm text-slate-300">2. Navigate to your site editor or HTML/code section</li>
                        <li className="text-sm text-slate-300">3. Paste the badge script before the closing &lt;/body&gt; tag</li>
                        <li className="text-sm text-slate-300">4. Save and publish your changes</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-4 rounded-xl font-semibold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
            >
              Run Free Trust Check
            </button>
          </div>
        </div>
      </div>

      <CrozoraFooter />
    </div>
  );
}