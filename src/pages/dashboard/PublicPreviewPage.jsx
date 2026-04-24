import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import VerifiedBadge from '@/components/VerifiedBadge';
import { CheckCircle, Eye, ExternalLink } from 'lucide-react';

const publicChecks = [
  'Website ownership confirmed',
  'HTTPS detected',
  'Business contact information reviewed',
  'Public business policies found',
  'No major scam-risk signals detected',
  'Badge authenticity confirmed',
];

export default function PublicPreviewPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Public Trust Page Preview</h1>
        <p className="text-slate-500 text-sm mt-1">This is what customers see after clicking your badge</p>
      </div>

      <div className="max-w-lg">
        <div className="mb-4 flex items-center gap-2">
          <Eye size={14} className="text-slate-500" />
          <span className="text-xs text-slate-500">Customer view — crozora.com/verify/tuneteachers</span>
          <button onClick={() => navigate('/verify/tuneteachers')} className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            <ExternalLink size={11} /> View full page
          </button>
        </div>

        {/* Mock public page */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.2)', background: '#080f1f' }}>
          {/* Header bar */}
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="w-4 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }} />
            <span className="text-xs text-white font-medium">Crozora Verification</span>
            <span className="ml-auto text-xs text-slate-500">crozora.com</span>
          </div>

          <div className="p-6">
            {/* Status */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              }}>
                <CheckCircle size={24} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white font-space mb-1">TuneTeachers is Crozora Verified</h2>
              <div className="status-active inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 px-2">
              {[
                ['Website', 'tuneteachers.com'],
                ['Last Verified', 'April 2026'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Checks */}
            <div className="space-y-1.5 mb-5">
              {publicChecks.map(check => (
                <div key={check} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">{check}</span>
                </div>
              ))}
            </div>

            <p className="text-xs p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)', color: 'rgba(100,116,139,0.7)' }}>
              Crozora verification means this business passed Crozora's trust checks at the time shown. It does not guarantee every customer experience.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}