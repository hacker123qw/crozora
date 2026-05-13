import DashboardLayout from '@/components/DashboardLayout';
import { Compass, Search, Zap, ArrowRight, Briefcase } from 'lucide-react';

const builders = [
  {
    name: 'Alex Chen',
    role: 'Full-Stack Developer',
    skills: ['React', 'Node.js', 'Supabase'],
    focus: 'Building a fintech dashboard for freelancers',
    lookingFor: 'Designer, Product thinker',
    projects: 3,
    color: '#3b82f6',
    status: 'Active',
  },
  {
    name: 'Priya Nair',
    role: 'Product Designer',
    skills: ['Figma', 'UX Research', 'Design Systems'],
    focus: 'Improving SaaS onboarding flows',
    lookingFor: 'Dev co-founder',
    projects: 1,
    color: '#8b5cf6',
    status: 'Active',
  },
  {
    name: 'Marcus Lee',
    role: 'AI Engineer',
    skills: ['Python', 'LLMs', 'FastAPI'],
    focus: 'Automating content workflows with AI',
    lookingFor: 'Product lead, Business co-founder',
    projects: 2,
    color: '#06b6d4',
    status: 'Active',
  },
  {
    name: 'Sam Torres',
    role: 'Frontend Developer',
    skills: ['Vue', 'TypeScript', 'CSS'],
    focus: 'Open-source dev tooling',
    lookingFor: 'Marketing help, Backend dev',
    projects: 4,
    color: '#10b981',
    status: 'Active',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Indie Maker',
    skills: ['Notion', 'No-code', 'Community'],
    focus: 'Building a community around async work',
    lookingFor: 'Dev to build the platform',
    projects: 1,
    color: '#f59e0b',
    status: 'Active',
  },
  {
    name: 'Riya Sharma',
    role: 'Growth Hacker',
    skills: ['SEO', 'Content', 'Analytics'],
    focus: 'Helping indie builders get their first 100 users',
    lookingFor: 'Technical partner',
    projects: 2,
    color: '#ec4899',
    status: 'Active',
  },
];

const roleFilters = ['All', 'Developer', 'Designer', 'AI Builder', 'Maker', 'Growth'];

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Compass size={14} className="text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Discover Builders</span>
          </div>
          <h1 className="text-2xl font-space font-bold text-white mb-2">Find your collaborators.</h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
            Not a job board. Not forced networking. Intelligent opportunity discovery — built around what people are actually building.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 px-4 rounded-xl"
            style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)' }}>
            <Search size={15} className="text-slate-500 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none"
              placeholder="Search by skill, focus, or name..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {roleFilters.map(f => (
              <button key={f}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${f === 'All' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={f === 'All' ? { background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Builder cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {builders.map((b) => (
            <div key={b.name} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300"
              style={{ border: `1px solid ${b.color}18` }}>
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${b.color} 0%, ${b.color}88 100%)` }}>
                  {b.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{b.name}</div>
                  <div className="text-xs truncate" style={{ color: 'rgba(100,116,139,0.7)' }}>{b.role}</div>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full status-active">{b.status}</span>
                </div>
              </div>

              {/* Focus */}
              <div className="mb-3 p-3 rounded-lg" style={{ background: `${b.color}08`, border: `1px solid ${b.color}12` }}>
                <p className="text-xs text-slate-500 mb-0.5">Currently building</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>{b.focus}</p>
              </div>

              {/* Skills */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {b.skills.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: `${b.color}10`, color: b.color, border: `1px solid ${b.color}20` }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Looking for */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">Looking for</p>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.75)' }}>{b.lookingFor}</p>
              </div>

              {/* Meta + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
                  <Briefcase size={11} />
                  {b.projects} project{b.projects > 1 ? 's' : ''}
                </div>
                <button className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ background: `${b.color}12`, color: b.color, border: `1px solid ${b.color}22` }}>
                  Connect <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state / load more placeholder */}
        <div className="mt-10 text-center py-6">
          <p className="text-xs" style={{ color: 'rgba(100,116,139,0.5)' }}>
            Showing 6 of 800+ builders in the ecosystem.
          </p>
          <button className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 mx-auto">
            Load more builders <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
