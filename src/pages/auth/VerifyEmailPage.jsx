import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  AuthButton,
  AuthInput,
  AuthNotice,
  AuthShell,
} from '@/components/auth/AuthShell';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    authChecked,
    isAuthenticated,
    isLoadingAuth,
    authError,
    resendVerificationEmail,
    updatePassword,
  } = useAuth();
  const [mode, setMode] = useState(searchParams.get('mode') === 'recovery' ? 'recovery' : 'verify');
  const [statusMessage, setStatusMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });

  const redirectTo = useMemo(() => `${window.location.origin}/verify-email`, []);
  const pendingEmail = location.state?.email || localStorage.getItem('crozora_pending_verification_email') || '';

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hashType = hash.get('type');
    const queryType = searchParams.get('type');
    if (hashType === 'recovery' || queryType === 'recovery' || searchParams.get('mode') === 'recovery') {
      setMode('recovery');
    }
  }, [searchParams]);

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get('code');
      if (!code) {
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setSubmitError(error.message || 'Unable to verify this link.');
        return;
      }

      setStatusMessage('Verification complete. You can continue now.');
    };

    exchangeCode();
  }, [searchParams]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) {
      return;
    }

    if (mode === 'recovery') {
      return;
    }

    const hasBiz = !!sessionStorage.getItem('crozora_biz');
    navigate(hasBiz ? '/dashboard/home' : '/onboarding', { replace: true });
  }, [authChecked, isAuthenticated, mode, navigate]);

  const handleResend = async () => {
    if (!pendingEmail) {
      setSubmitError('Go back to sign up first so we know which email to resend to.');
      return;
    }

    setSubmitError('');
    setStatusMessage('');
    setIsResending(true);

    const { error } = await resendVerificationEmail({
      email: pendingEmail,
      redirectTo,
    });

    setIsResending(false);

    if (error) {
      setSubmitError(error.message || 'Unable to resend verification email.');
      return;
    }

    setStatusMessage(`Verification email resent to ${pendingEmail}.`);
  };

  const handlePasswordUpdate = async () => {
    setSubmitError('');
    setStatusMessage('');

    if (!passwords.password || !passwords.confirm) {
      setSubmitError('Enter your new password twice.');
      return;
    }

    if (passwords.password !== passwords.confirm) {
      setSubmitError('Passwords do not match.');
      return;
    }

    const { error } = await updatePassword({
      password: passwords.password,
    });

    if (error) {
      setSubmitError(error.message || 'Unable to update your password.');
      return;
    }

    setStatusMessage('Password updated successfully.');
    setTimeout(() => navigate('/dashboard/home', { replace: true }), 800);
  };

  const currentError = submitError || authError?.message;

  return (
    <AuthShell
      eyebrow={mode === 'recovery' ? 'Reset password' : 'Verify email'}
      title={mode === 'recovery' ? 'Choose a new password' : 'Verify your email'}
      description={mode === 'recovery'
        ? 'Enter a new password to finish resetting your account.'
        : 'We sent you a verification link. Open it to continue.'}
      footer={(
        <p className="text-sm text-slate-400">
          Need a different path?{' '}
          <Link to={mode === 'recovery' ? '/forgot-password' : '/login'} className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            {mode === 'recovery' ? 'Request a new reset link' : 'Back to sign in'}
          </Link>
        </p>
      )}
    >
      {mode === 'recovery' ? (
        <div className="space-y-5">
          <AuthNotice tone="info" title="Password reset">
            Enter your new password below to finish resetting your account.
          </AuthNotice>

          <div className="grid gap-5">
            <AuthInput
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a new password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              trailing={<KeyRound size={16} className="text-slate-500" />}
            />

            <AuthInput
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              trailing={<ShieldCheck size={16} className="text-slate-500" />}
            />
          </div>

          {currentError ? (
            <AuthNotice tone="error" title="Password update failed">
              {currentError}
            </AuthNotice>
          ) : null}

          {statusMessage ? (
            <AuthNotice tone="success" title="Password updated">
              {statusMessage}
            </AuthNotice>
          ) : null}

          <AuthButton onClick={handlePasswordUpdate} disabled={isLoadingAuth}>
            {isLoadingAuth ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Updating password...
              </>
            ) : (
              <>
                Update password
                <ChevronRight size={16} />
              </>
            )}
          </AuthButton>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                <Mail size={24} />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-white">Verification in progress</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Open the link from your inbox to confirm your email address and continue.
                </p>
              </div>
            </div>
          </div>

          {pendingEmail ? (
            <AuthNotice tone="neutral" title="Pending address">
              We are waiting on confirmation for <span className="font-semibold text-white">{pendingEmail}</span>.
            </AuthNotice>
          ) : (
            <AuthNotice tone="warning" title="Email not found">
              We could not find a pending email address for this screen.
            </AuthNotice>
          )}

          {currentError ? (
            <AuthNotice tone="error" title="Verification link issue">
              {currentError}
            </AuthNotice>
          ) : null}

          {statusMessage ? (
            <AuthNotice tone="success" title="Success">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                <span>{statusMessage}</span>
              </div>
            </AuthNotice>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <AuthButton
              onClick={() => {
                const hasBiz = !!sessionStorage.getItem('crozora_biz');
                navigate(hasBiz ? '/dashboard/home' : '/onboarding');
              }}
            >
              Continue
              <ArrowRight size={16} />
            </AuthButton>

            <AuthButton secondary onClick={handleResend} disabled={isResending}>
              {isResending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  Resend email
                  <Mail size={16} />
                </>
              )}
            </AuthButton>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
