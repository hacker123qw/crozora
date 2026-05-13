import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/AuthContext';
import { Edit3, Plus, Zap, ExternalLink, Star, GitBranch } from 'lucide-react';

const skillOptions = ['React', 'Node.js', 'Python', 'AI/ML', 'Design', 'Product', 'Marketing', 'Mobile'];

const mockProjects = [
  { name: 'AI Content Studio', stage: 'MVP', role: 'Builder', status: 'active' },
  { name: 'Crozora Profile Plugin', stage: 'Idea', role: 'Co-founder', status: 'forming' },
];

export default function BuilderProfilePage() {
  const { user } = useAuth();
  const displayName = user?.email?.split('@')[0] ?? 'Builder';

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-violet-400" />
              <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Builder Profile</span>
            </div>
            <h1 className="text-2xl font-space font-bold text-white">Your Builder Identity</h1>
          </div>
          <button className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
            <Edit3 size={13} />
            Edit Profile
          </button>
        </div>

        {/* Profile card */}
        <div className="glass-card rounded-2xl p-6 mb-6" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-space font-bold text-white mb-1">{displayName}</h2>
              <p className="text-sm mb-1" style={{ color: 'rgba(100,116,139,0.8)' }}>Builder · Crozora Ecosystem</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400">Active builder</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
            <p className="text-xs font-medium text-slate-400 mb-2">What I'm building</p>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
              Add a short bio about what you're currently working on and what excites you...
            </p>
            <button className="mt-3 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              <Plus size={11} /> Add bio
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Skills</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <Plus size={11} /> Add skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map(skill => (
              <span key={skill} className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:scale-105"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'rgba(148,163,184,0.8)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Looking for */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">What I'm looking for</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {['Co-founder', 'Designer', 'Technical Partner'].map(role => (
              <div key={role} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                <span className="text-xs font-medium text-violet-300">{role}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            <Edit3 size={11} /> Edit what I'm looking for
          </button>
        </div>

        {/* Active projects */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Active Projects</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <Plus size={11} /> New project
            </button>
          </div>
          <div className="space-y-3">
            {mockProjects.map(({ name, stage, role, status }) => (
              <div key={name} className="flex items-center justify-between py-3 px-4 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                <div className="flex items-center gap-3">
                  <GitBranch size={14} className="text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{name}</p>
                    <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>{role} · {stage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'active' ? 'status-active' : 'status-pending'}`}>
                    {status === 'active' ? 'Active' : 'Forming'}
                  </span>
                  <button className="text-slate-600 hover:text-slate-400 transition-colors">
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reputation */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Momentum & Reputation</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Projects', value: '2', color: '#3b82f6' },
              { label: 'Collaborators', value: '0', color: '#8b5cf6' },
              { label: 'Builder Score', value: '—', color: '#06b6d4' },
            ].map(({ label, value, color }) => (
              <div key={label} className="py-4 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                <div className="text-2xl font-bold font-space mb-1" style={{ color }}>{value}</div>
                <div className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>{label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: 'rgba(100,116,139,0.5)' }}>
            Reputation grows as you build, ship, and collaborate inside Crozora.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
