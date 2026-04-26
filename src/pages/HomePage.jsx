import { useNavigate } from 'react-router-dom';
import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import VerifiedBadge from '@/components/VerifiedBadge';
import {
  Shield, CheckCircle, Globe, Lock,
  ArrowRight, Eye, ChevronRight, Search, Award, MousePointerClick, RefreshCw
} from 'lucide-react';

const badgeWhyCards = [
  { icon: MousePointerClick, title: 'Clickable proof', desc: 'A Crozora badge links to a public verification page customers can check themselves.' },
  { icon: Shield, title: 'Not just an image', desc: 'Badge status can show active, expired, suspended, or not found — customers know what they\'re looking at.' },
  { icon: Eye, title: 'Customer-facing clarity', desc: 'Customers see a simple public trust page, not your private business report.' },
  { icon: RefreshCw, title: 'Ongoing status', desc: 'Pro users can receive ongoing rechecks and badge status monitoring over time.' },
];

const steps = [
  { num: '01', icon: Search, label: 'Run a free trust preview', desc: 'Submit your business URL. Crozora reviews visible trust signals and gives you a limited preview result.' },
  { num: '02', icon: Globe, label: 'Verify website ownership', desc: 'Add a simple DNS TXT record to confirm you own the domain.' },
  { num: '03', icon: Lock, label: 'Choose one-time or Pro', desc: 'Pay $30 for one website or $20/month for Crozora Pro covering multiple websites.' },
  { num: '04', icon: Award, label: 'Approved websites display a live badge', desc: 'If your website passes verification, you can install a live Crozora Verified Badge.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden grid-pattern">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Trust Verification Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-space font-bold text-white leading-tight mb-6">
                Make your business
                <span className="gradient-text"> easier to trust online.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(148,163,184,0.8)' }}>
                Crozora helps websites and service businesses complete a trust preview, verify ownership, and display a live badge linked to a public verification page when approved.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}>
                  Run Free Trust Preview
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5"
                  style={{ border: '1px solid rgba(59,130,246,0.25)', color: 'rgba(148,163,184,0.9)' }}>
                  See How It Works
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex items-center gap-8 mt-10">
                {[['$0', 'Free Preview'], ['$30', 'One-Time Verification'], ['$20/mo', 'Crozora Pro']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-xl font-bold font-space text-white">{val}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.8)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero visual */}
            <div className="relative animate-float">
              {/* Main card */}
              <div className="glass-card rounded-2xl p-6 glow-blue">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Private Site Report</p>
                    <p className="text-white font-bold text-lg font-space">www.example.com</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mb-1">Trust Score</span>
                    <span className="text-2xl font-bold font-space" style={{ color: '#34d399' }}>87/100</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full mb-4" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <div className="h-2 rounded-full" style={{ width: '87%', background: 'linear-gradient(90deg, #3b82f6, #34d399)' }} />
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    ['Website Ownership', 'Verified'],
                    ['HTTPS Status', 'Active'],
                    ['Contact Info', 'Consistent'],
                    ['Scam Risk', 'Low'],
                    ['Policy Pages', 'Found'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-1">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className="text-xs font-medium text-emerald-400">✓ {val}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(59,130,246,0.12)' }}>
                  <div>
                    <p className="text-xs text-slate-500">Badge Status</p>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">● Active</p>
                  </div>
                  <VerifiedBadge size="sm" />
                </div>
              </div>

              {/* Floating: public trust page */}
              <div className="absolute -bottom-8 -left-8 glass-card-light rounded-xl p-4 w-52 hidden lg:block">
                <p className="text-xs text-slate-500 mb-2">Public Trust Page</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white">Active & Verified</span>
                </div>
                <p className="text-xs text-slate-500">Last checked: April 2026</p>
                <p className="text-xs text-blue-400 mt-1.5">crozora.com/verify/example →</p>
              </div>

              {/* Floating: ownership */}
              <div className="absolute -top-6 -right-6 glass-card-light rounded-xl p-3 hidden lg:block">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-xs font-medium text-white">Ownership Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why a live badge matters ── */}
      <section className="py-24" style={{ background: 'rgba(8,15,31,0.8)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-space font-bold text-white mb-4">Why a live badge matters</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              A static image means nothing. A Crozora badge is a live, verifiable trust signal.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {badgeWhyCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Icon size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Public proof, private details ── */}
      <section className="py-24 grid-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-space font-bold text-white mb-4">Public proof, private details</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Customers see a simple public verification page. Business owners see private report details based on their plan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Public */}
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(20,184,166,0.2)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.15)' }}>
                  <Eye size={12} className="text-teal-400" />
                </div>
                <h3 className="text-white font-semibold">Public Trust Page</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(20,184,166,0.1)', color: '#2dd4bf' }}>For Customers</span>
              </div>
              {['Verification status', 'Ownership confirmed', 'Checks passed', 'Last checked date', 'Report issue button'].map(item => (
                <div key={item} className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <CheckCircle size={13} className="text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{ color: 'rgba(100,116,139,0.6)' }}>Only visible for approved websites on a paid plan.</p>
            </div>

            {/* Private */}
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <Lock size={12} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold">Private Site Report</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>For Owners</span>
              </div>
              {[
                { text: 'Advanced report — One-Time $30 plan', pro: false },
                { text: 'Advanced score breakdown — Pro', pro: true },
                { text: 'Improvement recommendations', pro: false },
                { text: 'Deeper technical guidance — Pro', pro: true },
                { text: 'Recheck guidance', pro: false },
              ].map(({ text, pro }) => (
                <div key={text} className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <CheckCircle size={13} className={pro ? 'text-violet-400 flex-shrink-0' : 'text-blue-400 flex-shrink-0'} />
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How Crozora works ── */}
      <section className="py-24" style={{ background: 'rgba(8,15,31,0.9)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-space font-bold text-white mb-4">How Crozora works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, icon: Icon, label, desc }) => (
              <div key={num} className="relative">
                <div className="glass-card rounded-xl p-6">
                  <div className="text-xs font-mono text-blue-400 mb-4 opacity-60">{num}</div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{label}</h3>
                  <p className="text-sm" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
                </div>
                {num !== '04' && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-blue-800 z-10">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Badge preview ── */}
      <section className="py-24 grid-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-space font-bold text-white mb-4">See the badge in action</h2>
            <p className="text-lg" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Click the badge to see what customers see on the public verification page.
            </p>
          </div>
          <div className="max-w-md mx-auto glass-card rounded-2xl p-6 glow-blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">AB</div>
              <div>
                <p className="text-white font-semibold text-sm">Acme Business Co.</p>
                <p className="text-xs text-slate-500">www.example.com</p>
              </div>
              <div className="ml-auto text-xs px-2 py-0.5 rounded-full status-active">Active</div>
            </div>
            <p className="text-sm text-slate-400 mb-4">This business completed Crozora verification and displays a live trust badge linked to their public verification page.</p>
            <div className="pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.12)' }}>
              <VerifiedBadge size="md" onClick={() => window.open('/verify/example', '_blank')} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 halo-blue" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Start with a free trust preview.
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(148,163,184,0.7)' }}>
            No credit card required. See where your website stands before choosing a plan.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', boxShadow: '0 0 40px rgba(59,130,246,0.35)' }}>
            Run Free Trust Preview
          </button>
        </div>
      </section>

      <CrozoraFooter />
    </div>
  );
}
