import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/AuthContext';
import { ArrowRight, Zap, FolderOpen, Compass, Bot, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const feedItems = [
  {
    type: 'project',
    title: 'AI-powered recipe generator launched',
    author: 'Jordan Kim',
    role: 'Full-Stack Dev',
    time: '2h ago',
    tags: ['AI', 'SaaS', 'MVP'],
    color: '#3b82f6',
    excerpt: 'Just shipped the first version of my recipe tool powered by Claude. Looking for a designer to join.',
  },
  {
    type: 'discover',
    title: 'Marcus Lee is looking to collaborate',
    author: 'Marcus Lee',
    role: 'AI Engineer',
    time: '4h ago',
    tags: ['Python', 'LLMs', 'Automation'],
    color: '#8b5cf6',
    excerpt: 'Building content automation workflows and looking for a co-founder who can handle the product side.',
  },
  {
    type: 'idea',
    title: 'Idea: Automated grant-writing tool for indie devs',
    author: 'Priya Nair',
    role: 'Product Designer',
    time: '6h ago',
    tags: ['Idea', 'Grants', 'Tooling'],
    color: '#10b981',
    excerpt: 'Grant applications take forever. What if AI helped indie builders write better grant proposals faster?',
  },
  {
    type: 'project',
    title: 'Open Builder: Crozora-connected portfolio plugin',
    author: 'Sam Torres',
    role: 'Frontend Dev',
    time: '1d ago',
    tags: ['Open Source', 'Plugin', 'Portfolio'],
    color: '#f59e0b',
    excerpt: 'Building a lightweight portfolio plugin that syncs with Crozora profiles. Looking for 1-2 contributors.',
  },
];

const quickActions = [
  { icon: FolderOpen, label: 'Start a Project', path: '/dashboard/projects', color: '#3b82f6' },
  { icon: Compass, label: 'Discover Builders', path: '/dashboard/discover', color: '#8b5cf6' },
  { icon: Lightbulb, label: 'Post an Idea', path: '/dashboard/ideas', color: '#10b981' },
  { icon: Bot, label: 'AI Co-Builder', path: '/dashboard/ai', color: '#06b6d4' },
];

const typeLabel = { project: 'Project', discover: 'Builder', idea: 'Idea' };
const typeBg = { project: 'rgba(59,130,246,0.1)', discover: 'rgba(139,92,246,0.1)', idea: 'rgba(16,185,129,0.1)' };
const typeColor = { project: '#60a5fa', discover: '#a78bfa', idea: '#34d399' };

export default function EcosystemFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.email?.split('@')[0] ?? 'Builder';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Welcome header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Ecosystem Feed</span>
          </div>
          <h1 className="text-3xl font-space font-bold text-white mb-2">
            Welcome back, {displayName}.
          </h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.8)' }}>
            Here's what's alive in the Crozora ecosystem today.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {quickActions.map(({ icon: Icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="glass-card rounded-xl p-4 text-left hover:-translate-y-0.5 transition-all duration-200 group"
              style={{ border: `1px solid ${color}15` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: TrendingUp, label: 'Active Projects', value: '2,418', color: '#3b82f6' },
            { icon: Users, label: 'Builders Online', value: '894', color: '#8b5cf6' },
            { icon: Zap, label: 'Connections Today', value: '142', color: '#06b6d4' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center" style={{ border: `1px solid ${color}15` }}>
              <Icon size={16} className="mx-auto mb-2" style={{ color }} />
              <div className="text-xl font-bold font-space text-white">{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Live Ecosystem Activity</h2>
          <span className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>Updated just now</span>
        </div>

        <div className="space-y-4">
          {feedItems.map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}88 100%)` }}>
                  {item.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: typeBg[item.type], color: typeColor[item.type] }}>
                      {typeLabel[item.type]}
                    </span>
                    <span className="text-sm font-semibold text-white">{item.author}</span>
                    <span className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>· {item.role} · {item.time}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">{item.title}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(100,116,139,0.85)' }}>{item.excerpt}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'rgba(148,163,184,0.7)' }}>
                        {tag}
                      </span>
                    ))}
                    <button className="ml-auto text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                      View <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder empty state hint */}
        <div className="mt-8 text-center py-8">
          <p className="text-xs" style={{ color: 'rgba(100,116,139,0.5)' }}>
            Complete your builder profile to see personalized recommendations.
          </p>
          <button onClick={() => navigate('/dashboard/profile')}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mx-auto">
            Set up my profile <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
