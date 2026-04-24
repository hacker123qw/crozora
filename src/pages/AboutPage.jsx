import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { Shield, Target, Eye, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />
      <div className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              Our Mission
            </div>
            <h1 className="text-5xl font-space font-bold text-white mb-6">About Crozora</h1>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Crozora was created to help businesses prove credibility online and help customers understand basic trust signals before engaging with a company.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: Target,
                title: 'Why Crozora Exists',
                content: 'The internet has made it easy to build a website, but it has not made it easy for customers to tell which businesses are legitimate. Crozora exists to bridge that gap — giving businesses a structured way to demonstrate credibility and giving customers a consistent signal they can rely on.',
              },
              {
                icon: Shield,
                title: 'The Problem With Online Trust',
                content: 'Customers face a real challenge when researching an unfamiliar business online. Reviews can be faked. Websites can look polished. Certifications can be fabricated. There was no neutral, verifiable signal that a business had passed any kind of structured check. Crozora addresses this directly.',
              },
              {
                icon: Eye,
                title: 'Our Approach',
                content: 'We scan publicly available signals — website ownership, HTTPS status, contact information, policy pages, and reputation patterns. We verify domain control using DNS records. We do not make claims we cannot verify, and we do not guarantee outcomes we cannot measure.',
              },
              {
                icon: Target,
                title: 'Transparency Over Blind Trust',
                content: 'Crozora is not a rating service. We do not say a business is "5 stars" or "safe." We say: this business passed these specific checks at this point in time. That is a narrow but honest claim — and we believe narrow, honest claims are more valuable than broad promises.',
              },
              {
                icon: Award,
                title: 'Built for Businesses That Want to Prove Legitimacy',
                content: 'Crozora is for businesses that have nothing to hide and want customers to know it. It is for local service businesses, online platforms, professional services, and any organization that understands that trust is earned, not assumed.',
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="glass-card rounded-2xl p-8 flex gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}>
                  <Icon size={22} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-space mb-3">{title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>{content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CrozoraFooter />
    </div>
  );
}