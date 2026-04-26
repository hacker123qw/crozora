import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  AuthButton,
  AuthInput,
  AuthNotice,
  AuthShell,
} from '@/components/auth/AuthShell';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, authChecked, isLoadingAuth, authError } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      const hasBiz = !!sessionStorage.getItem('crozora_biz');
      navigate(hasBiz ? '/dashboard/home' : '/onboarding', { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate]);

  const handleLogin = async () => {
    setSubmitError('');

    if (!form.email || !form.password) {
      setSubmitError('Enter your email and password.');
      return;
    }

    const { error } = await signIn({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setSubmitError(error.message || 'Unable to sign in.');
      return;
    }

    const hasBiz = !!sessionStorage.getItem('crozora_biz');
    navigate(hasBiz ? '/dashboard/home' : '/onboarding', { replace: true });
  };

  const currentError = submitError || authError?.message;

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Sign in to Crozora"
      description="Use your email and password to access your account."
      footer={(
        <p className="text-sm text-slate-400">
          New to Crozora?{' '}
          <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Create an account
          </Link>
        </p>
      )}
    >
      <div className="space-y-5">
        <div className="grid gap-5">
          <AuthInput
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            trailing={<Mail size={16} className="text-slate-500" />}
          />

          <AuthInput
            label="Password"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <ShieldCheck size={14} className="text-emerald-300" />
            Secure account access
          </div>
          <Link to="/forgot-password" className="font-medium text-cyan-300 transition hover:text-cyan-200">
            Forgot password?
          </Link>
        </div>

        {currentError ? (
          <AuthNotice tone="error" title="Could not sign you in">
            {currentError}
          </AuthNotice>
        ) : (
          <AuthNotice tone="neutral" title="Secure sign in">
            Use the same email address you signed up with to continue to your account.
          </AuthNotice>
        )}

        <AuthButton onClick={handleLogin} disabled={isLoadingAuth}>
          {isLoadingAuth ? (
            <>
              <LockKeyhole size={16} className="animate-pulse" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </AuthButton>
      </div>
    </AuthShell>
  );
}
