import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Globe, ArrowRight } from 'lucide-react';

export default function AddBusinessPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!url.trim()) {
      setError('Please enter your website URL.');
      return;
    }
    if (!url.includes('.')) {
      setError('Please enter a valid website URL.');
      return;
    }
    navigate('/dashboard/ownership');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="text-blue-400 font-semibold">Step 1</span>
          <span>/ 4</span>
        </div>
        <h1 className="text-3xl font-bold font-space text-white">Enter Your Website URL</h1>
        <p className="text-slate-400 text-sm mt-2">We'll run a free trust scan on your website. No credit card needed.</p>
      </div>

      <div className="max-w-lg">
        <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Globe size={17} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Your Website</p>
              <p className="text-xs text-slate-500">We scan publicly available information only</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs text-slate-500 mb-2 block">Website URL</label>
            <input
              type="url"
              placeholder="https://www.yourdomain.com"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40"
              style={{ background: 'rgba(59,130,246,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.2)'}` }}
            />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            <p className="text-xs text-slate-600 mt-2">Example: https://www.example.com</p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 25px rgba(59,130,246,0.25)' }}
          >
            Continue to Domain Verification
            <ArrowRight size={15} />
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-4 text-center">
          Next: You'll add a simple DNS record to prove you own the website.
        </p>
      </div>
    </DashboardLayout>
  );
}