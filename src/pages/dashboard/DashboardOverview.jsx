import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Globe, ScanLine, Award, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getLatestWebsiteForOwner } from '@/services/websites';
import { getLatestDomainVerification } from '@/services/domainVerification';
import { getLatestScanForWebsite } from '@/services/trustScans';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    domain: '',
    hasWebsite: false,
    ownershipVerified: false,
    previewComplete: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!user?.id) return;

      try {
        const website = await getLatestWebsiteForOwner(user.id);
        if (!website) return;

        const [verification, scan] = await Promise.all([
          getLatestDomainVerification(website.id),
          getLatestScanForWebsite(website.id),
        ]);

        if (!cancelled) {
          setProgress({
            domain: website.normalized_domain || website.website_url || '',
            hasWebsite: true,
            ownershipVerified: verification?.status === 'verified' || website.ownership_status === 'verified',
            previewComplete: scan?.status === 'completed' || website.preview_status === 'complete',
          });
        }
      } catch {
        if (!cancelled) {
          setProgress((current) => current);
        }
      }
    }

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const steps = [
    {
      num: 1,
      icon: Globe,
      label: 'Enter Your Website URL',
      desc: progress.hasWebsite ? `Saved for ${progress.domain || 'your website'}.` : 'Tell us your website so we can run a trust check.',
      action: '/dashboard/add-business',
      status: progress.hasWebsite ? 'done' : 'start',
    },
    {
      num: 2,
      icon: Globe,
      label: 'Verify Domain Ownership',
      desc: progress.ownershipVerified ? 'Ownership verified with your DNS TXT record.' : 'Add a DNS TXT record to confirm you own the website.',
      action: '/dashboard/ownership',
      status: progress.hasWebsite ? (progress.ownershipVerified ? 'done' : 'start') : 'locked',
    },
    {
      num: 3,
      icon: ScanLine,
      label: 'Run Trust Scan',
      desc: progress.previewComplete ? 'Your free preview scan has been saved to your account.' : 'We scan your website for trust signals and generate your report.',
      action: '/dashboard/scan',
      status: progress.ownershipVerified ? (progress.previewComplete ? 'done' : 'start') : 'locked',
    },
    {
      num: 4,
      icon: Award,
      label: 'Get Your Verified Badge',
      desc: 'Approved businesses receive a live Crozora Verified Badge for their site.',
      action: '/dashboard/badge',
      status: progress.previewComplete ? 'start' : 'locked',
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-space text-white">Welcome to Crozora</h1>
        <p className="text-slate-400 text-sm mt-2">Follow these steps to verify your business and earn your trust badge.</p>
      </div>

      <div className="max-w-xl space-y-4">
        {steps.map(({ num, icon: Icon, label, desc, action, status }) => {
          const isStart = status === 'start';
          const isDone = status === 'done';
          const isLocked = status === 'locked';

          return (
            <div
              key={num}
              onClick={() => (isStart || isDone) && navigate(action)}
              className={`glass-card rounded-2xl p-6 flex items-center gap-5 transition-all duration-200 ${isStart || isDone ? 'cursor-pointer hover:border-blue-500/40 hover:-translate-y-0.5' : 'opacity-50'}`}
              style={{ border: isStart || isDone ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(59,130,246,0.1)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDone
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : isStart
                    ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
                    : 'rgba(59,130,246,0.05)',
                  border: isStart || isDone ? 'none' : '1px solid rgba(59,130,246,0.15)',
                }}
              >
                {isLocked ? <Lock size={18} className="text-slate-600" /> : <Icon size={20} className="text-white" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-slate-600">Step {num}</span>
                </div>
                <p className={`font-semibold text-sm ${isStart || isDone ? 'text-white' : 'text-slate-600'}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${isStart || isDone ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
              </div>

              {(isStart || isDone) && <ChevronRight size={18} className="text-blue-400 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-5 rounded-xl max-w-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
        <p className="text-xs text-slate-500 leading-relaxed">
          Each step unlocks after the previous one is completed. Start by entering your website URL - the scan is free and your progress is now saved to your account.
        </p>
      </div>
    </DashboardLayout>
  );
}
