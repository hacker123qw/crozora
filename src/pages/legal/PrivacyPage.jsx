import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide when creating an account or submitting a business for verification, including your name, email address, and business details. We also collect technical information such as IP address, browser type, and usage data when you interact with our platform.',
  },
  {
    title: 'Business Verification Data',
    content: 'When you submit a business for verification, we collect and store the business name, website URL, business email, service area, and business category. This information is used to perform trust checks and is retained as part of your verification record.',
  },
  {
    title: 'Website Scan Data',
    content: 'Crozora performs automated scans on submitted websites. Scan data includes HTTPS status, domain information, publicly visible contact details, policy page presence, and reputation signals. This data is used to generate trust scores and verification reports. Scan data is stored for the duration of your verification period.',
  },
  {
    title: 'Payment Data',
    content: 'Payment processing is handled by third-party processors. Crozora does not store full credit card numbers or payment credentials. We may retain transaction records including payment amounts, dates, and plan details for billing and compliance purposes.',
  },
  {
    title: 'Cookies and Analytics',
    content: 'Crozora uses cookies to maintain session state and improve user experience. We may use analytics tools to understand how users interact with our platform. You may disable cookies through your browser settings, though this may affect platform functionality.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your account and verification data for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes.',
  },
  {
    title: 'Contact',
    content: 'If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@crozora.com. We will respond to privacy-related requests within 30 days.',
  },
];

export default function PrivacyPage() {
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
            <h1 className="text-5xl font-space font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-sm" style={{ color: 'rgba(100,116,139,0.7)' }}>Last updated: April 2026</p>
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