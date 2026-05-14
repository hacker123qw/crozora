import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getExplicitSiteUrl } from '@/lib/site-url';
import {
  AuthButton,
  AuthInput,
  AuthNotice,
  AuthShell,
} from '@/components/auth/AuthShell';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, authChecked, isLoadingAuth, authError } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitError, setSubmitError] = useState('');

  // Only pass emailRedirectTo when VITE_SITE_URL is explicitly configured.
  // Sending window.location.origin risks a URL not in Supabase's allowed
  // redirect list, which causes GoTrue to reject the signup entirely.
  const redirectTo = useMemo(() => {
    const base = getExplicitSiteUrl();
    return base ? `${base}/verify-email` : undefined;
  }, []);

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      const hasBiz = !!sessionStorage.getItem('crozora_biz');
      navigate(hasBiz ? '/dashboard/feed' : '/onboarding', { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate]);

  const handleSignup = async () => {
    setSubmitError('');

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setSubmitError('Fill out every field to create your account.');
      return;
    }

    if (form.password !== form.confirm) {
      setSubmitError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }

    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      name: form.name,
      redirectTo,
    });

    if (error) {
      setSubmitError(error.message || 'Unable to create account.');
      return;
    }

    localStorage.setItem('crozora_pending_verification_email', form.email);

    if (data?.session) {
      sessionStorage.removeItem('crozora_biz');
      navigate('/onboarding', { replace: true });
      return;
    }

    navigate('/verify-email', {
      replace: true,
      state: { email: form.email },
    });
  };

  const currentError = submitError || authError?.message;

  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your Crozora account"
      description="Set up your account to continue to onboarding."
      footer={(
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Sign in
          </Link>
        </p>
      )}
    >
      <div className="space-y-5">
        <div className="grid gap-5">
          <AuthInput
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            trailing={<UserRound size={16} className="text-slate-500" />}
          />

          <AuthInput
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            trailing={<Mail size={16} className="text-slate-500" />}
          />

          <AuthInput
            label="Password"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            hint="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            trailing={(
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="rounded-full p-1 text-slate-500 transition hover:bg-white/10 hover:text-slate-200"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          />

          <AuthInput
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            trailing={<LockKeyhole size={16} className="text-slate-500" />}
          />
        </div>

        {currentError ? (
          <AuthNotice tone="error" title="Could not create your account">
            {currentError}
          </AuthNotice>
        ) : (
          <AuthNotice tone="info" title="Verify your email">
            If email verification is enabled, we will send you a confirmation link after you sign up.
          </AuthNotice>
        )}

        <AuthButton onClick={handleSignup} disabled={isLoadingAuth}>
          {isLoadingAuth ? (
            <>
              <LockKeyhole size={16} className="animate-pulse" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </AuthButton>
      </div>
    </AuthShell>
  );
}
