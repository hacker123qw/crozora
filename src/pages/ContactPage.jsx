import { useState } from 'react';
import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import { Mail, CheckCircle, Award, Globe, CreditCard, AlertTriangle, Shield } from 'lucide-react';

const helpTopics = [
  { icon: Award, title: 'Badge Installation Help', desc: 'Step-by-step guidance for installing your badge on any platform.' },
  { icon: Globe, title: 'DNS Verification Help', desc: 'Assistance with adding TXT records to your DNS provider.' },
  { icon: CreditCard, title: 'Billing Questions', desc: 'Questions about charges, plans, invoices, or cancellations.' },
  { icon: AlertTriangle, title: 'Report a Badge Issue', desc: 'Report a business displaying a badge you believe is invalid.' },
  { icon: Shield, title: 'Business Verification Questions', desc: 'Questions about the verification process or your scan results.' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />
      <div className="pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-space font-bold text-white mb-4">Contact & Support</h1>
            <p className="text-lg" style={{ color: 'rgba(148,163,184,0.7)' }}>
              We're here to help. Reach out with questions about verification, badges, or billing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="glass-card rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <CheckCircle size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                  <p className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    We'll get back to you at {form.email || 'your email'} within 1–2 business days.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-blue-400 hover:text-blue-300">
                    Send another message
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white font-space mb-6">Send a Message</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={e => setForm({ ...form, [key]: e.target.value })}
                          className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40"
                          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Topic</label>
                      <select
                        value={form.topic}
                        onChange={e => setForm({ ...form, topic: e.target.value })}
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-slate-300 outline-none"
                        style={{ background: 'rgba(8,15,31,0.9)', border: '1px solid rgba(59,130,246,0.15)' }}
                      >
                        <option value="">Select a topic</option>
                        {helpTopics.map(t => <option key={t.title} value={t.title}>{t.title}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Describe your question or issue..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40 resize-none"
                        style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
                      />
                    </div>

                    <button
                      onClick={() => setSubmitted(true)}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-2 transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side */}
            <div>
              <div className="glass-card rounded-xl p-5 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Mail size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Support</p>
                  <p className="text-sm font-semibold text-white">support@crozora.com</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Common Help Topics</h3>
              <div className="space-y-3">
                {helpTopics.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="glass-card rounded-xl p-4 flex gap-3 hover:border-blue-500/25 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)'
                    }}>
                      <Icon size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CrozoraFooter />
    </div>
  );
}