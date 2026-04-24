import { useNavigate } from 'react-router-dom';
import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const plans = [
  {
    name: 'Free Trust Preview',
    price: '$0',
    period: '',
    subtitle: 'A limited preview before verification.',
    badge: null,
    included: [
      'Limited website trust preview',
      'Simple readiness result',
      'Ownership verification step',
    ],
    notIncluded: [
      'Crozora Verified Badge',
      'Public trust page',
      'Detailed site report',
      'Advanced recommendations',
    ],
    cta: 'Run Free Preview',
    ctaPath: '/signup',
    ctaStyle: 'outline',
    note: null,
  },
  {
    name: 'One-Time Site Verification',
    price: '$30',
    period: 'one-time per website',
    subtitle: 'For verifying one specific website.',
    badge: 'Most Popular',
    included: [
      'Badge access for this website if approved',
      'Public trust page for this website if approved',
      'Basic site report',
      'Basic explanation of pass/fail',
      'Basic improvement suggestions',
      'Basic recheck guidance',
    ],
    notIncluded: [
      'Multiple websites',
      'Advanced technical guidance',
      'Ongoing monitoring across websites',
      'Full Pro dashboard access',
    ],
    cta: 'Verify One Website',
    ctaPath: '/signup',
    ctaStyle: 'gradient',
    note: 'Applies to one website only. Additional websites require another $30 verification unless you are on Crozora Pro.',
  },
  {
    name: 'Crozora Pro',
    price: '$20',
    period: '/month',
    subtitle: 'For multiple websites and deeper trust guidance.',
    badge: null,
    included: [
      'Multiple websites under one account',
      'Badge access for approved websites',
      'Public trust pages for approved websites',
      'Advanced trust reports',
      'Detailed improvement guidance',
      'Deeper technical recommendations',
      'Ongoing rechecks',
      'Badge monitoring',
      'Badge install support',
    ],
    notIncluded: [],
    cta: 'Start Crozora Pro',
    ctaPath: '/signup',
    ctaStyle: 'teal',
    note: null,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />

      <div className="pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-space font-bold text-white mb-4">Transparent Pricing</h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Start with a free preview. Pay $30 to verify one website. Or go Pro for $20/month to cover multiple websites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div key={plan.name} className="relative glass-card rounded-2xl p-7 flex flex-col"
                style={plan.badge ? { border: '1px solid rgba(59,130,246,0.35)', boxShadow: '0 0 40px rgba(59,130,246,0.1)' } : {}}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white font-space mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold font-space text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-500 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-sm mt-2" style={{ color: 'rgba(100,116,139,0.85)' }}>{plan.subtitle}</p>
                </div>

                <div className="flex-1 mb-6 space-y-1">
                  {plan.included.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">Includes</p>
                      <div className="space-y-2.5">
                        {plan.included.map(text => (
                          <div key={text} className="flex items-start gap-2.5">
                            <CheckCircle size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-300">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {plan.notIncluded.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-2 font-medium">Not included</p>
                      <div className="space-y-2">
                        {plan.notIncluded.map(text => (
                          <div key={text} className="flex items-start gap-2.5">
                            <X size={13} className="text-slate-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {plan.note && (
                  <p className="text-xs mb-4 p-3 rounded-lg leading-relaxed"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(251,191,36,0.8)' }}>
                    {plan.note}
                  </p>
                )}

                <button
                  onClick={() => navigate(plan.ctaPath)}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={
                    plan.ctaStyle === 'gradient'
                      ? { background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', color: 'white', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }
                      : plan.ctaStyle === 'teal'
                      ? { background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', color: 'white' }
                      : { border: '1px solid rgba(59,130,246,0.25)', color: 'rgba(148,163,184,0.9)', background: 'rgba(59,130,246,0.04)' }
                  }>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Global disclaimer */}
          <div className="max-w-2xl mx-auto glass-card rounded-xl p-5 text-center" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle size={15} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Important</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
              <strong className="text-white">Payment never guarantees badge approval.</strong> Crozora badges are only active for websites that pass verification. A website must pass Crozora's trust checks before receiving an active badge, regardless of plan.
            </p>
          </div>
        </div>
      </div>

      <CrozoraFooter />
    </div>
  );
}