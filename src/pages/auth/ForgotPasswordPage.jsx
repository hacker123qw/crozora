import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-pattern" style={{ background: '#050b18' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-2xl">Crozora</span>
          </Link>
          <h1 className="text-3xl font-space font-bold text-white mt-6 mb-2">Reset Password</h1>
          <p className="text-sm" style={{ color: 'rgba(148,163,184,0.6)' }}>Enter your email to receive reset instructions</p>
        </div>

        <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(148,163,184,0.7)' }}>
                If an account exists for <span className="text-white">{email}</span>, reset instructions will be sent.
              </p>
              <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">Back to login</Link>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                />
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
              >
                Send Reset Instructions
              </button>
              <div className="text-center mt-4">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1">
                  <ArrowLeft size={12} /> Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}