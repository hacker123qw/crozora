import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { AlertTriangle, Shield } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />
      <div className="pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              Legal Disclaimer
            </div>
            <h1 className="text-5xl font-space font-bold text-white mb-3">Disclaimer</h1>
            <p className="text-sm" style={{ color: 'rgba(100,116,139,0.7)' }}>Last updated: April 2026</p>
          </div>

          {/* Primary disclaimer */}
          <div className="rounded-2xl p-8 mb-8" style={{ background: 'rgba(245,158,11,0.06)', border: '2px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <AlertTriangle size={22} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-400 font-space mb-3">Important Notice</h2>
                <p className="text-base leading-relaxed text-white">
                  Crozora verification means a business passed Crozora's specific trust checks at the time of verification. It does not mean Crozora guarantees that the business is safe, perfect, scam-free, or risk-free.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'What Verification Means',
                content: 'A Crozora Verified badge indicates that at the time of verification, the business passed a set of defined trust signal checks. These checks include website ownership verification, HTTPS status, contact information presence, policy page visibility, and basic reputation signal analysis.',
              },
              {
                title: 'What Verification Does Not Mean',
                content: 'Crozora verification does not constitute a guarantee, warranty, or endorsement of any kind. It does not mean the business is government-certified, professionally licensed, legally compliant, fraud-free, or immune to customer complaints. Crozora is not responsible for any transaction, interaction, or outcome between a customer and a verified business.',
              },
              {
                title: 'Verification Expires and Can Be Revoked',
                content: 'Trust signals change over time. A business that passed verification at one point in time may no longer meet the same standards at a later date. Verification badges expire and require renewal. Crozora may revoke or suspend badges at any time if signals change, complaints are received, or standards are no longer met.',
              },
              {
                title: 'No Legal or Financial Advice',
                content: 'Nothing on the Crozora platform constitutes legal, financial, professional, or regulatory advice. Customers should conduct their own due diligence before engaging with any business, whether or not that business holds a Crozora Verified badge.',
              },
              {
                title: 'Limitation of Liability',
                content: 'Crozora assumes no liability for any loss, damage, or harm resulting from reliance on verification results, badge status, or any information displayed on the platform. Use of Crozora and any reliance on its results is entirely at your own risk.',
              },
            ].map(({ title, content }) => (
              <div key={title} className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white font-space mb-3">{title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>{content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl flex items-start gap-3" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <Shield size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
              If you have questions about this disclaimer or Crozora's verification standards, please visit our <a href="/trust-standards" className="text-blue-400 hover:text-blue-300">Trust Standards</a> page or contact us at legal@crozora.com.
            </p>
          </div>
        </div>
      </div>
      <CrozoraFooter />
    </div>
  );
}