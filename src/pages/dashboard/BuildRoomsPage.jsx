import DashboardLayout from '@/components/DashboardLayout';
import { Radio, Users, Bot, Zap, ArrowRight, Sparkles, GitMerge } from 'lucide-react';

const upcomingFeatures = [
  {
    icon: Radio,
    color: '#f59e0b',
    title: 'Live Project Rooms',
    desc: 'Real-time collaborative spaces where teams build together. Share context, decisions, and progress in a living room.',
  },
  {
    icon: Sparkles,
    color: '#8b5cf6',
    title: 'Brainstorming Spaces',
    desc: 'Structured brainstorm rooms with AI facilitation. Turn vague ideas into scoped, actionable projects.',
  },
  {
    icon: Bot,
    color: '#06b6d4',
    title: 'AI-Assisted Sessions',
    desc: 'An AI layer joins your Build Room to summarize discussions, suggest next steps, and keep the team unblocked.',
  },
  {
    icon: Users,
    color: '#10b981',
    title: 'Team Formation',
    desc: 'From solo builder to structured team. Build Rooms give new collaborators context fast so they can hit the ground running.',
  },
  {
    icon: GitMerge,
    color: '#3b82f6',
    title: 'Project Updates',
    desc: 'Replace scattered async updates with structured project check-ins right inside the room.',
  },
  {
    icon: Zap,
    color: '#ec4899',
    title: 'Momentum Tracking',
    desc: 'Each Build Room surfaces a momentum score — keeping teams honest about whether they\'re moving or stalling.',
  },
];

export default function BuildRoomsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <Radio size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Build Rooms</span>
          </div>
          <h1 className="text-2xl font-space font-bold text-white mb-2">Live collaborative spaces.</h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
            Not a Discord server. Not a Notion doc. A living room for your project — where builders and AI work in the same space.
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-2xl p-8 mb-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Radio size={24} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-space font-bold text-white mb-2">Build Rooms are coming.</h2>
          <p className="text-sm max-w-lg mx-auto mb-6" style={{ color: 'rgba(148,163,184,0.75)' }}>
            We're building the most focused collaboration layer for ambitious builders. Live rooms, AI assistance, team formation, and momentum — all in one place.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)', boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}>
            Join the waitlist
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Feature preview grid */}
        <h2 className="text-sm font-semibold text-white mb-5">What's coming in Build Rooms</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingFeatures.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card rounded-xl p-5"
              style={{ border: `1px solid ${color}14` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Teaser visual */}
        <div className="mt-10 rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'rgba(8,15,31,0.8)', border: '1px solid rgba(59,130,246,0.08)' }}>
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Preview</p>
            <p className="text-sm text-slate-400">What a Build Room will look like</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['AI Summary', 'Team Members', 'Next Steps'].map((label, i) => (
              <div key={label} className="rounded-xl p-4 text-center opacity-40"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <div className="w-6 h-6 rounded bg-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
            style={{ background: 'rgba(5,11,24,0.6)', backdropFilter: 'blur(2px)' }}>
            <span className="text-xs font-medium px-4 py-2 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
