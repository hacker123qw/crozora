import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle, ScanLine, ChevronRight, Lock, AlertCircle, Zap } from 'lucide-react';

const scanChecks = [
  { label: 'Website security (HTTPS, certificates)' },
  { label: 'Contact information signals' },
  { label: 'Business policy pages (terms, privacy, refund)' },
  { label: 'Reputation and review patterns' },
  { label: 'Scam and risk indicators' },
  { label: 'Service and content clarity' },
];

export default function TrustScanPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | scanning | done
  const [progress, setProgress] = useState(0);
  const [completedChecks, setCompletedChecks] = useState([]);
  const [result, setResult] = useState(null); // 'pass' | 'review'

  const startScan = () => {
    setPhase('scanning');
    setCompletedChecks([]);
    setProgress(0);

    scanChecks.forEach((_, i) => {
      setTimeout(() => {
        setCompletedChecks(prev => [...prev, i]);
        setProgress(Math.round(((i + 1) / scanChecks.length) * 100));

        if (i === scanChecks.length - 1) {
          setTimeout(() => {
            setPhase('done');
            setResult('pass');
          }, 500);
        }
      }, (i + 1) * 600);
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="text-blue-400 font-semibold">Step 3</span>
          <span>/ 4</span>
        </div>
        <h1 className="text-3xl font-bold font-space text-white">Trust Scan</h1>
        <p className="text-slate-400 text-sm mt-2">We'll analyze your website across six trust signal categories.</p>
      </div>

      <div className="max-w-xl space-y-5">

        {/* Idle — ready to scan */}
        {phase === 'idle' && (
          <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.1) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <ScanLine size={28} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white font-space mb-2">Ready to Scan</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              We'll check your website across six trust categories. This takes about 30 seconds.
            </p>
            <button
              onClick={startScan}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 mx-auto transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 25px rgba(59,130,246,0.25)' }}
            >
              <Zap size={15} />
              Start Free Scan
            </button>
          </div>
        )}

        {/* Scanning */}
        {phase === 'scanning' && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <ScanLine size={18} className="text-blue-400 animate-pulse" />
              <h3 className="text-white font-bold">Scanning your website…</h3>
              <span className="ml-auto text-blue-400 font-mono text-sm font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
            </div>
            <div className="space-y-2">
              {scanChecks.map(({ label }, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.03)' }}>
                  {completedChecks.includes(i) ? (
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className={`text-sm transition-colors ${completedChecks.includes(i) ? 'text-slate-300' : 'text-slate-600'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> Scan Complete
              </h3>
              <div className="space-y-2 mb-4">
                {scanChecks.map(({ label }, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.03)' }}>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{label}</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-400">Checked</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">Likely Qualifies for Verification</span>
              </div>
              <p className="text-sm text-slate-300 mb-5">
                Your website passed the free trust scan. Unlock your full private report to see the detailed breakdown and confirm badge eligibility.
              </p>
              <button
                onClick={() => navigate('/dashboard/report')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
              >
                View Full Report
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Locked note */}
            <div className="flex items-start gap-2.5 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
              <Lock size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">
                This is your free scan summary. Detailed scores, failed checks, and improvement recommendations are in the private report.
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}