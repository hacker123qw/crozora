import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Search, Zap, Users, TrendingUp, GitBranch, ArrowRight } from 'lucide-react';

const sampleProjects = [
  {
    name: 'AI Content Studio',
    description: 'A tool that uses LLMs to draft, refine, and schedule social content for indie builders.',
    category: 'AI / Productivity',
    stage: 'MVP',
    lookingFor: true,
    needed: ['Designer', 'Marketing'],
    momentum: 'high',
    members: 2,
    color: '#3b82f6',
  },
  {
    name: 'GrantBot',
    description: 'Automated grant-writing tool for indie developers and early-stage founders.',
    category: 'Developer Tools',
    stage: 'Idea',
    lookingFor: true,
    needed: ['Co-founder', 'Frontend Dev'],
    momentum: 'medium',
    members: 1,
    color: '#8b5cf6',
  },
  {
    name: 'Crozora Profile Plugin',
    description: 'Lightweight embeddable portfolio plugin that syncs with Crozora builder profiles.',
    category: 'Open Source',
    stage: 'Building',
    lookingFor: true,
    needed: ['Contributors'],
    momentum: 'high',
    members: 3,
    color: '#10b981',
  },
  {
    name: 'BuildStack',
    description: 'A curated tool stack aggregator for different builder archetypes.',
    category: 'Community',
    stage: 'Shipped',
    lookingFor: false,
    needed: [],
    momentum: 'low',
    members: 4,
    color: '#f59e0b',
  },
];

const stageColor = {
  Idea: { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  MVP: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  Building: { bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.2)' },
  Shipped: { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
};

const momentumDot = { high: 'bg-emerald-400', medium: 'bg-amber-400', low: 'bg-slate-500' };
const momentumLabel = { high: 'High momentum', medium: 'Building', low: 'Early stage' };

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-blue-400" />
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Projects</span>
            </div>
            <h1 className="text-2xl font-space font-bold text-white">Active Projects</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(100,116,139,0.7)' }}>
              Ideas turned into active builds. Join one or start your own.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
            <Plus size={15} />
            New Project
          </button>
        </div>

        {/* Search / filter bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 px-4 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <Search size={15} className="text-slate-500 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none"
              placeholder="Search projects..."
            />
          </div>
          {['All', 'Idea', 'MVP', 'Building', 'Shipped'].map(f => (
            <button key={f}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${f === 'All' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              style={f === 'All' ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Project cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {sampleProjects.map((p) => {
            const stage = stageColor[p.stage];
            return (
              <div key={p.name} className="glass-card rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300"
                style={{ border: `1px solid ${p.color}18` }}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                      <GitBranch size={15} style={{ color: p.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                      <span className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>{p.category}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: stage.bg, color: stage.text, border: `1px solid ${stage.border}` }}>
                    {p.stage}
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(100,116,139,0.85)' }}>
                  {p.description}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
                    <Users size={12} />
                    {p.members} builder{p.members > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
                    <TrendingUp size={12} />
                    {momentumLabel[p.momentum]}
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${momentumDot[p.momentum]}`} />
                </div>

                {/* Needed skills */}
                {p.lookingFor && p.needed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Looking for</p>
                    <div className="flex gap-2 flex-wrap">
                      {p.needed.map(n => (
                        <span key={n} className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: `${p.color}10`, color: p.color, border: `1px solid ${p.color}20` }}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
                  style={{ background: `${p.color}12`, border: `1px solid ${p.color}22`, color: p.color }}>
                  {p.lookingFor ? 'Request to Join' : 'View Project'}
                  <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA to start a project */}
        <div className="mt-10 text-center py-12 rounded-2xl"
          style={{ background: 'rgba(59,130,246,0.04)', border: '1px dashed rgba(59,130,246,0.15)' }}>
          <GitBranch size={28} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-400 mb-1">Have an idea?</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(100,116,139,0.6)' }}>
            Turn it into a project. Attract collaborators. Build together.
          </p>
          <button className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
            <Plus size={14} />
            Start a Project
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
