import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExplicitSiteUrl } from '@/lib/site-url';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  AuthButton,
  AuthInput,
  AuthNotice,
  AuthShell,
} from '@/components/auth/AuthShell';

export default function ForgotPasswordPage() {
  const { resetPassword, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Only pass redirectTo when VITE_SITE_URL is explicitly configured.
  const redirectTo = useMemo(() => {
    const base = getExplicitSiteUrl();
    return base ? `${base}/verify-email?mode=recovery` : undefined;
  }, []);

  const handleReset = async () => {
    setSubmitError('');

    if (!email) {
      setSubmitError('Enter your email address.');
      return;
    }

    const { error } = await resetPassword({
      email,
      redirectTo,
    });

    if (error) {
      setSubmitError(error.message || 'Unable to send reset email.');
      return;
    }

    localStorage.setItem('crozora_pending_verification_email', email);
    setSubmitted(true);
  };

  const currentError = submitError || authError?.message;

  return (
    <AuthShell
      eyebrow="Reset password"
      title={submitted ? 'Check your email' : 'Forgot your password?'}
      description={submitted
        ? 'If an account exists for this email, we sent you a password reset link.'
        : 'Enter your email address and we will send you a link to reset your password.'}
      footer={(
        <p className="text-sm text-slate-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Back to sign in
          </Link>
        </p>
      )}
    >
      {submitted ? (
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Email sent</h2>
                <p className="mt-2 text-sm leading-7 text-emerald-100/90">
                  If an account exists for <span className="font-semibold text-white">{email}</span>, reset instructions will arrive shortly.
                </p>
              </div>
            </div>
          </div>

          <AuthNotice tone="success" title="Next step">
            Open the email and use the link to choose a new password.
          </AuthNotice>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AuthButton secondary onClick={() => setSubmitted(false)} className="sm:flex-1">
              <RotateCcw size={16} />
              Use another email
            </AuthButton>
            <Link to="/login" className="sm:flex-1">
              <AuthButton className="sm:flex-1">
                Back to login
                <ArrowRight size={16} />
              </AuthButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <AuthInput
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            trailing={<Mail size={16} className="text-slate-500" />}
          />

          {currentError ? (
            <AuthNotice tone="error" title="Could not send reset email">
              {currentError}
            </AuthNotice>
          ) : (
            <AuthNotice tone="neutral" title="Reset link">
              If an account exists for this email address, a reset link will be sent.
            </AuthNotice>
          )}

          <AuthButton onClick={handleReset}>
            Send reset link
            <ArrowRight size={16} />
          </AuthButton>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
