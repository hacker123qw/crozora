import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';

const sections = [
  {
    title: '1. Use of Service',
    content: 'By accessing or using Crozora, you agree to be bound by these Terms of Service. Crozora provides a trust verification service for businesses and websites. Use of this service is restricted to lawful purposes only. You agree not to use Crozora in any manner that could damage, disable, overburden, or impair the service.',
  },
  {
    title: '2. Verification Limitations',
    content: 'Crozora performs automated and manual checks based on publicly available signals and verified ownership data. Verification results reflect the state of signals at the time of the check. Crozora does not guarantee that any verified business is safe, risk-free, or will provide a satisfactory customer experience. Verification is not an endorsement.',
  },
  {
    title: '3. Badge Usage',
    content: 'The Crozora Verified Badge is licensed to businesses that have passed Crozora\'s verification checks and maintain an active subscription. The badge may only be displayed on the website and business verified during the verification process. Transferring, selling, or reusing the badge for unverified entities is strictly prohibited. Crozora reserves the right to revoke badge access at any time.',
  },
  {
    title: '4. Payments',
    content: 'Certain Crozora services require payment. All payments are processed through third-party payment processors. Fees are non-refundable except as expressly stated. Subscription fees are billed monthly and will automatically renew unless cancelled. Payment does not guarantee verification approval or badge issuance.',
  },
  {
    title: '5. Account Responsibilities',
    content: 'You are responsible for maintaining the security of your account credentials. You agree to provide accurate and complete information when creating an account or submitting a business for verification. Crozora reserves the right to suspend accounts that violate these terms or provide false information.',
  },
  {
    title: '6. Prohibited Use',
    content: 'You may not use Crozora to submit false business information, attempt to obtain a badge under false pretenses, interfere with the verification process of other businesses, scrape or systematically extract data from the platform, or engage in any activity that violates applicable law or regulation.',
  },
  {
    title: '7. Suspension or Revocation',
    content: 'Crozora may suspend, revoke, or terminate badges and accounts at its sole discretion, including but not limited to cases where: the business no longer meets verification standards, customer complaints indicate material misrepresentation, or the business violates these terms. No refund is provided upon revocation for cause.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'To the maximum extent permitted by law, Crozora shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Crozora\'s total liability shall not exceed the amount paid by you to Crozora in the three months preceding the claim.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />
      <div className="pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              Legal
            </div>
            <h1 className="text-5xl font-space font-bold text-white mb-3">Terms of Service</h1>
            <p className="text-sm" style={{ color: 'rgba(100,116,139,0.7)' }}>Last updated: April 2026</p>
          </div>

          <div className="glass-card rounded-2xl p-2 mb-8">
            <div className="p-5 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
                Please read these Terms of Service carefully before using Crozora. By using the platform, you agree to be bound by these terms.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map(({ title, content }) => (
              <div key={title} className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white font-space mb-3">{title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CrozoraFooter />
    </div>
  );
}