import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { Shield, Globe, Lock, Users, FileText, Star, AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';

const verifies = [
  { icon: Globe, title: 'Website Ownership', desc: 'DNS TXT record verification confirms the business controls the domain.' },
  { icon: Lock, title: 'Domain & HTTPS Status', desc: 'SSL certificate validity and secure connection status.' },
  { icon: Users, title: 'Business Identity Signals', desc: 'Business name, address, and entity consistency across the web.' },
  { icon: FileText, title: 'Contact Information', desc: 'Presence and consistency of contact details across the site.' },
  { icon: Shield, title: 'Policy Visibility', desc: 'Terms of service, privacy policy, and refund policy presence.' },
  { icon: Star, title: 'Review/Reputation Signals', desc: 'Pattern analysis of public review activity.' },
  { icon: AlertTriangle, title: 'Scam-Risk Indicators', desc: 'Detection of known red flags and deceptive patterns.' },
  { icon: Eye, title: 'Badge Authenticity', desc: 'Every badge links to a live Crozora verification page.' },
];

const doesNotClaim = [
  'Crozora does not guarantee a business is perfect or risk-free',
  'Crozora does not guarantee every customer experience',
  'Crozora does not replace legal, financial, or professional advice',
  'Crozora only confirms that a business passed Crozora\'s verification checks at the time shown',
  'Verification can expire, be suspended, or be revoked at any time',
];

const badgeStatuses = [
  { status: 'Active', desc: 'Business has passed verification and badge is live.', color: 'status-active' },
  { status: 'Expired', desc: 'Verification period has ended. Recheck required.', color: 'status-expired' },
  { status: 'Suspended', desc: 'Badge temporarily suspended pending review.', color: 'status-suspended' },
  { status: 'Not Found', desc: 'No verification record exists for this business.', color: 'status-pending' },
];

export default function TrustStandardsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />

      <div className="pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              Transparency & Standards
            </div>
            <h1 className="text-5xl font-space font-bold text-white mb-4">Trust Standards</h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              What Crozora checks, what the badge means, and what we do not claim.
            </p>
          </div>

          {/* What Crozora verifies */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white font-space mb-8">What Crozora Verifies</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {verifies.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass-card rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                  }}>
                    <Icon size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm">{title}</h3>
                    <p className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What Crozora does NOT claim */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white font-space mb-8">What Crozora Does Not Claim</h2>
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={18} className="text-red-400" />
                <span className="text-red-400 font-semibold text-sm">Important Limitations</span>
              </div>
              <div className="space-y-3">
                {doesNotClaim.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < doesNotClaim.length - 1 ? '1px solid rgba(59,130,246,0.06)' : 'none' }}>
                    <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm" style={{ color: 'rgba(203,213,225,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Badge authenticity */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white font-space mb-8">Badge Authenticity</h2>
            <div className="glass-card rounded-2xl p-6 mb-6">
              <p className="text-sm mb-4" style={{ color: 'rgba(148,163,184,0.8)' }}>
                Every real Crozora badge links directly to a public Crozora verification page. You can always verify a badge is genuine by clicking it. If the badge does not redirect to crozora.com/verify/[business-name], it is not a valid Crozora badge.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                <CheckCircle size={14} />
                Every badge URL is unique to each business
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badgeStatuses.map(({ status, desc, color }) => (
                <div key={status} className="glass-card rounded-xl p-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${color}`}>
                    {status}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Methodology */}
          <section>
            <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <h2 className="text-xl font-bold text-white font-space mb-4">Our Methodology</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(148,163,184,0.7)' }}>
                Crozora uses a combination of automated scanning and manual review to evaluate business trust signals. Our scoring is based on publicly available signals and verified ownership data. No verification is permanent — businesses are rechecked regularly, and badges can be revoked if signals change.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
                We do not make claims about a business's quality of service, customer satisfaction, or legal standing. Crozora is a trust signal platform — not a guarantee service. Customers should always conduct their own due diligence.
              </p>
            </div>
          </section>
        </div>
      </div>

      <CrozoraFooter />
    </div>
  );
}