import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, ChevronRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-pattern" style={{ background: '#050b18' }}>
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-white font-space font-bold text-2xl">Crozora</span>
        </Link>

        <div className="glass-card rounded-2xl p-10" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(59,130,246,0.25)',
          }}>
            <Mail size={28} className="text-blue-400" />
          </div>

          <h1 className="text-2xl font-space font-bold text-white mb-3">Check your email</h1>
          <p className="text-sm mb-2" style={{ color: 'rgba(148,163,184,0.7)' }}>
            We sent a verification link to your inbox.
          </p>
          <p className="text-sm mb-8" style={{ color: 'rgba(148,163,184,0.5)' }}>
            Click the link in the email to verify your account and continue to your dashboard.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
          >
            Continue to Dashboard
            <ChevronRight size={15} />
          </button>

          <p className="text-xs mt-4" style={{ color: 'rgba(100,116,139,0.5)' }}>
            Didn't receive the email?{' '}
            <button className="text-blue-400 hover:text-blue-300">Resend</button>
          </p>
        </div>
      </div>
    </div>
  );
}