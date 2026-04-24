import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-pattern" style={{ background: '#050b18' }}>
      {/* Halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
            }}>
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-2xl">Crozora</span>
          </Link>
          <h1 className="text-3xl font-space font-bold text-white mt-6 mb-2">Welcome back</h1>
          <p className="text-sm" style={{ color: 'rgba(148,163,184,0.6)' }}>Sign in to your Crozora account</p>
        </div>

        <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 transition"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
              </div>
            </div>

            <button
              onClick={() => {
                // If they've already completed onboarding, go to dashboard. Otherwise start the wizard.
                const hasBiz = !!sessionStorage.getItem('crozora_biz');
                navigate(hasBiz ? '/dashboard/home' : '/onboarding');
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-2 transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 25px rgba(59,130,246,0.3)' }}
            >
              Login
            </button>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'rgba(100,116,139,0.7)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}