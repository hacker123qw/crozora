import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import PublicVerificationCard from '@/components/public/PublicVerificationCard';
import { getPublicVerificationBySlug } from '@/services/badges';

function LoadingCard() {
  return (
    <div className="glass-card rounded-3xl p-10 text-center">
      <div className="w-12 h-12 rounded-2xl mx-auto mb-4 animate-pulse" style={{ background: 'rgba(59,130,246,0.12)' }} />
      <p className="text-white font-semibold mb-2">Checking Crozora verification</p>
      <p className="text-sm text-slate-400">Please wait while we load the live verification record.</p>
    </div>
  );
}

export default function PublicVerifyPage() {
  const { businessId } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const data = await getPublicVerificationBySlug(businessId);
        if (active) {
          setVerification(data);
        }
      } catch (error) {
        if (active) {
          setLoadError(error.message || 'We could not load this verification page right now.');
          setVerification({
            status: 'not_found',
            businessName: businessId,
            message: 'We could not confirm a live Crozora verification record for this page right now.',
          });
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
  }, [businessId]);

  return (
    <div className="min-h-screen grid-pattern" style={{ background: '#050b18' }}>
      <header className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-white font-space font-bold">Crozora</span>
        </Link>
        <span className="text-xs text-slate-500">Verification Page</span>
      </header>

      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
      />

      <div className="max-w-lg mx-auto px-6 py-12 relative">
        {loading ? <LoadingCard /> : <PublicVerificationCard verification={verification} />}

        {loadError ? (
          <p className="text-center text-xs text-red-300 mt-4">{loadError}</p>
        ) : null}

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-600 hover:text-slate-500 transition-colors">
            Powered by Crozora · crozora.com
          </Link>
        </div>
      </div>
    </div>
  );
}
