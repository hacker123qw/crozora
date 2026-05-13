import DashboardLayout from '@/components/DashboardLayout';
import { Store, Search, Zap, ArrowRight, Bot, FileText, Package, Layers, Wrench, Users } from 'lucide-react';

const categories = [
  { icon: Bot, label: 'AI Agents', count: 'Coming soon', color: '#06b6d4' },
  { icon: Zap, label: 'Prompts', count: 'Coming soon', color: '#8b5cf6' },
  { icon: Layers, label: 'Workflows', count: 'Coming soon', color: '#3b82f6' },
  { icon: FileText, label: 'Templates', count: 'Coming soon', color: '#10b981' },
  { icon: Package, label: 'Startup Resources', count: 'Coming soon', color: '#f59e0b' },
  { icon: Wrench, label: 'Builder Tools', count: 'Coming soon', color: '#ec4899' },
];

const featuredItems = [
  {
    name: 'Founder Brief Generator',
    type: 'AI Agent',
    desc: 'Generates a one-page founder brief from a rough idea description. Perfect for attracting co-founders.',
    author: 'Crozora Labs',
    color: '#06b6d4',
    free: true,
  },
  {
    name: 'Project Momentum Tracker',
    type: 'Template',
    desc: 'A structured weekly check-in template that helps builders measure real progress and surface blockers.',
    author: 'Sam Torres',
    color: '#10b981',
    free: true,
  },
  {
    name: 'Cold DM Prompt Pack',
    type: 'Prompt Pack',
    desc: '12 battle-tested prompts for reaching out to potential co-founders, advisors, and early users.',
    author: 'Riya Sharma',
    color: '#8b5cf6',
    free: false,
    price: '$9',
  },
  {
    name: 'MVP Scoping Workshop',
    type: 'Workflow',
    desc: 'A 5-step AI-assisted workflow to take a raw idea and define a shippable MVP scope in under 2 hours.',
    author: 'Marcus Lee',
    color: '#3b82f6',
    free: false,
    price: '$19',
  },
];

export default function MarketplacePage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Store size={14} className="text-pink-400" />
            <span className="text-xs font-medium text-pink-400 uppercase tracking-wider">Marketplace</span>
          </div>
          <h1 className="text-2xl font-space font-bold text-white mb-2">The Builder Marketplace.</h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
            AI agents, prompts, workflows, templates, and tools — built by and for the Crozora builder ecosystem.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 rounded-xl mb-8"
          style={{ background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.12)' }}>
          <Search size={15} className="text-slate-500 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent py-3 text-sm text-slate-300 placeholder-slate-600 outline-none"
            placeholder="Search agents, templates, prompts..."
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {categories.map(({ icon: Icon, label, count, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
              style={{ border: `1px solid ${color}15` }}>
              <div className="w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2"
                style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <p className="text-xs font-medium text-slate-300 mb-0.5">{label}</p>
              <p className="text-xs" style={{ color: 'rgba(100,116,139,0.55)', fontSize: '10px' }}>{count}</p>
            </div>
          ))}
        </div>

        {/* Featured section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Featured Items</h2>
            <span className="text-xs text-pink-400">Early access · More coming</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {featuredItems.map((item) => (
              <div key={item.name} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300"
                style={{ border: `1px solid ${item.color}18` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}22` }}>
                    {item.type}
                  </span>
                  <span className="ml-auto text-xs font-bold" style={{ color: item.free ? '#34d399' : '#fbbf24' }}>
                    {item.free ? 'Free' : item.price}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(100,116,139,0.85)' }}>{item.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
                    <Users size={11} />
                    {item.author}
                  </div>
                  <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}22` }}>
                    {item.free ? 'Get free' : `Buy ${item.price}`}
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sell CTA */}
        <div className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(236,72,153,0.12)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.4), transparent)' }} />
          <Store size={28} className="mx-auto text-pink-400 mb-4" />
          <h2 className="text-lg font-space font-bold text-white mb-2">Sell what you've built.</h2>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'rgba(148,163,184,0.75)' }}>
            Have an AI agent, prompt pack, or workflow that helps builders? List it in the Crozora Marketplace.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', boxShadow: '0 0 25px rgba(236,72,153,0.2)' }}>
            Apply to sell
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
