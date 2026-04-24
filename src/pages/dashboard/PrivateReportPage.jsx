import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Lock, CheckCircle, XCircle, AlertCircle, TrendingUp, RefreshCw, ChevronRight, Award } from 'lucide-react';

const passed = [
  'Website is served over HTTPS',
  'Domain ownership verified via DNS',
  'Contact page found with email and phone',
  'Privacy policy page detected',
  'No active phishing reports found',
  'Terms of service page present',
];

const needsImprovement = [
  'Refund policy not clearly linked from homepage',
  'Review profile not claimed on major platforms',
];

const failed = [
  'Business address not verified against public records',
];

const recommendations = [
  'Add a direct link to your refund policy from the homepage footer',
  'Claim your business profile on Google and Yelp',
  'Add a verified business address to your contact page',
];

export default function PrivateReportPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Private Trust Report</h1>
        <p className="text-slate-500 text-sm mt-1">Full score breakdown, improvement plan, and badge eligibility</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {!unlocked ? (
          /* Locked state */
          <div className="glass-card rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)'
            }}>
              <Lock size={28} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white font-space mb-3">Full Trust Report Locked</h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Upgrade to see your detailed score breakdown, failed checks, improvement recommendations, and badge eligibility.
            </p>
            <button
              onClick={() => setUnlocked(true)}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
            >
              Unlock Report — $29
            </button>
            <p className="text-xs mt-3 text-slate-600">One-time payment. Immediate access.</p>
          </div>
        ) : (
          /* Unlocked state */
          <div className="space-y-5">
            {/* Score */}
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold font-space">Overall Trust Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold font-space" style={{ color: '#34d399' }}>87</span>
                  <span className="text-slate-500 text-sm">/ 100</span>
                </div>
              </div>
              <div className="w-full h-3 rounded-full mb-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <div className="h-3 rounded-full" style={{ width: '87%', background: 'linear-gradient(90deg, #3b82f6, #34d399)' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Low Risk</span>
                <span>Score: Eligible</span>
              </div>
            </div>

            {/* Badge eligibility */}
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Award size={20} className="text-emerald-400" />
              <div>
                <p className="text-white font-semibold text-sm">Badge Eligible</p>
                <p className="text-xs text-slate-400">Your business qualifies for the Crozora Verified Badge.</p>
              </div>
              <button onClick={() => navigate('/dashboard/badge')} className="ml-auto text-xs text-emerald-400 font-medium flex items-center gap-1">
                Setup Badge <ChevronRight size={12} />
              </button>
            </div>

            {/* Passed */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> Passed Checks
                <span className="ml-auto text-emerald-400 text-sm font-medium">{passed.length}</span>
              </h3>
              <div className="space-y-2">
                {passed.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs improvement */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" /> Needs Improvement
                <span className="ml-auto text-amber-400 text-sm font-medium">{needsImprovement.length}</span>
              </h3>
              <div className="space-y-2">
                {needsImprovement.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <XCircle size={16} className="text-red-400" /> Failed Checks
                <span className="ml-auto text-red-400 text-sm font-medium">{failed.length}</span>
              </h3>
              <div className="space-y-2">
                {failed.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-400" /> Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)' }}>
                    <span className="text-xs font-bold text-blue-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
              <RefreshCw size={14} /> Request Recheck
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}