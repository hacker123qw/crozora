import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle, Upload, ChevronRight } from 'lucide-react';

const statuses = ['Draft', 'Submitted', 'Under review', 'Approved', 'Rejected'];

export default function VerificationApplicationPage() {
  const [activeStatus, setActiveStatus] = useState('Draft');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: 'TuneTeachers',
    website: 'tuneteachers.com',
    serviceArea: 'Online / United States',
    termsUrl: '',
    privacyUrl: '',
    reviewUrl: '',
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Verification Application</h1>
        <p className="text-slate-500 text-sm mt-1">Apply for the Crozora Verified Badge</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Status demo */}
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-3">Demo: Switch application status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setActiveStatus(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeStatus === s ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.05)',
                  border: activeStatus === s ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                  color: activeStatus === s ? '#60a5fa' : 'rgba(148,163,184,0.7)',
                }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Current status */}
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            activeStatus === 'Approved' ? 'bg-emerald-400' :
            activeStatus === 'Rejected' ? 'bg-red-400' :
            activeStatus === 'Under review' ? 'bg-amber-400' :
            'bg-blue-400'
          }`} />
          <span className="text-sm font-medium text-white">Status: {activeStatus}</span>
        </div>

        {!submitted ? (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-bold">Application Details</h3>

            {[
              { label: 'Confirm Business Name', key: 'businessName' },
              { label: 'Confirm Website', key: 'website' },
              { label: 'Confirm Service Area', key: 'serviceArea' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                />
              </div>
            ))}

            {/* Document upload placeholder */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Upload Business Document</label>
              <div className="rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors hover:border-blue-500/40"
                style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.02)' }}>
                <Upload size={20} className="text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-600 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            {/* Policy links */}
            {[
              { label: 'Terms of Service URL', key: 'termsUrl', placeholder: 'https://yourdomain.com/terms' },
              { label: 'Privacy Policy URL', key: 'privacyUrl', placeholder: 'https://yourdomain.com/privacy' },
              { label: 'Review Profile Link', key: 'reviewUrl', placeholder: 'https://g.page/yourbusiness' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                />
              </div>
            ))}

            <button
              onClick={() => { setSubmitted(true); setActiveStatus('Submitted'); }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
            >
              Submit for Review
              <ChevronRight size={15} />
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-space mb-2">Application Submitted</h3>
            <p className="text-sm text-slate-400 mb-4">Your verification application is under review. We'll notify you by email within 1–2 business days.</p>
            <button onClick={() => { setSubmitted(false); setActiveStatus('Under review'); }} className="text-sm text-blue-400 hover:text-blue-300">
              View application details
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}