import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Globe, ScanLine, Award, ChevronRight, Lock } from 'lucide-react';

const steps = [
  {
    num: 1,
    icon: Globe,
    label: 'Enter Your Website URL',
    desc: 'Tell us your website so we can run a trust check.',
    action: '/dashboard/add-business',
    status: 'start',
  },
  {
    num: 2,
    icon: Globe,
    label: 'Verify Domain Ownership',
    desc: 'Add a DNS TXT record to confirm you own the website.',
    action: '/dashboard/ownership',
    status: 'locked',
  },
  {
    num: 3,
    icon: ScanLine,
    label: 'Run Trust Scan',
    desc: 'We scan your website for trust signals and generate your report.',
    action: '/dashboard/scan',
    status: 'locked',
  },
  {
    num: 4,
    icon: Award,
    label: 'Get Your Verified Badge',
    desc: 'Approved businesses receive a live Crozora Verified Badge for their site.',
    action: '/dashboard/badge',
    status: 'locked',
  },
];

export default function DashboardOverview() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-space text-white">Welcome to Crozora</h1>
        <p className="text-slate-400 text-sm mt-2">Follow these steps to verify your business and earn your trust badge.</p>
      </div>

      <div className="max-w-xl space-y-4">
        {steps.map(({ num, icon: Icon, label, desc, action, status }) => {
          const isStart = status === 'start';
          const isLocked = status === 'locked';

          return (
            <div
              key={num}
              onClick={() => isStart && navigate(action)}
              className={`glass-card rounded-2xl p-6 flex items-center gap-5 transition-all duration-200 ${isStart ? 'cursor-pointer hover:border-blue-500/40 hover:-translate-y-0.5' : 'opacity-50'}`}
              style={{ border: isStart ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(59,130,246,0.1)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isStart
                    ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
                    : 'rgba(59,130,246,0.05)',
                  border: isStart ? 'none' : '1px solid rgba(59,130,246,0.15)',
                }}>
                {isLocked
                  ? <Lock size={18} className="text-slate-600" />
                  : <Icon size={20} className="text-white" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-slate-600">Step {num}</span>
                </div>
                <p className={`font-semibold text-sm ${isStart ? 'text-white' : 'text-slate-600'}`}>{label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
              </div>

              {isStart && (
                <ChevronRight size={18} className="text-blue-400 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-5 rounded-xl max-w-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
        <p className="text-xs text-slate-500 leading-relaxed">
          Each step unlocks after the previous one is completed. Start by entering your website URL — the scan is free and takes less than a minute.
        </p>
      </div>
    </DashboardLayout>
  );
}