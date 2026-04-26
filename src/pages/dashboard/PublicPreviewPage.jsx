import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PublicVerificationCard from '@/components/public/PublicVerificationCard';
import { useBizData } from '@/pages/dashboard/MainDashboard';
import { getPublicVerificationBySlug } from '@/services/badges';

export default function PublicPreviewPage() {
  const biz = useBizData();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const publicSlug = biz.latestBadge?.public_slug;

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!publicSlug) {
        setVerification(null);
        return;
      }

      setLoading(true);
      try {
        const data = await getPublicVerificationBySlug(publicSlug);
        if (active) {
          setVerification(data);
        }
      } catch {
        if (active) {
          setVerification(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [publicSlug]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Public Trust Page Preview</h1>
        <p className="text-slate-500 text-sm mt-1">This mirrors the page your customers see after clicking the live badge.</p>
      </div>

      <div className="max-w-lg">
        {!publicSlug ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-white font-semibold mb-2">No live public page yet</p>
            <p className="text-sm text-slate-400">Prepare your badge first so Crozora can create the public verification page.</p>
          </div>
        ) : loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-white font-semibold mb-2">Loading public preview</p>
            <p className="text-sm text-slate-400">Fetching the current live verification record.</p>
          </div>
        ) : (
          <PublicVerificationCard verification={verification} isPreview />
        )}
      </div>
    </DashboardLayout>
  );
}
