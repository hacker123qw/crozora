import DashboardLayout from '@/components/DashboardLayout';
import { Lightbulb, Plus, ThumbsUp, ArrowRight, Zap, MessageSquare } from 'lucide-react';

const sampleIdeas = [
  {
    title: 'Automated grant-writing tool for indie devs',
    desc: 'Grant applications take forever. AI could help indie builders write better proposals in a fraction of the time.',
    author: 'Priya Nair',
    votes: 47,
    comments: 12,
    tags: ['AI', 'Tooling', 'Grants'],
    color: '#10b981',
    hot: true,
  },
  {
    title: 'Builder reputation score across open source contributions',
    desc: 'A composite reputation signal that aggregates GitHub contributions, shipped projects, and collaboration history.',
    author: 'Sam Torres',
    votes: 31,
    comments: 8,
    tags: ['Reputation', 'Open Source', 'Data'],
    color: '#3b82f6',
    hot: false,
  },
  {
    title: 'Weekly async "build report" — what did you ship?',
    desc: 'A simple weekly prompt system that encourages builders to share small wins and keep momentum visible to the ecosystem.',
    author: 'Jordan Kim',
    votes: 28,
    comments: 6,
    tags: ['Community', 'Habits', 'Accountability'],
    color: '#8b5cf6',
    hot: false,
  },
  {
    title: 'AI-powered co-founder matching based on project DNA',
    desc: 'Not just skill matching — deep compatibility scoring based on what you\'re building, your work style, and your goals.',
    author: 'Marcus Lee',
    votes: 62,
    comments: 19,
    tags: ['AI', 'Matching', 'Co-founder'],
    color: '#06b6d4',
    hot: true,
  },
];

export default function IdeasPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Ideas</span>
            </div>
            <h1 className="text-2xl font-space font-bold text-white mb-1">The Ideas Board</h1>
            <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
              Raw ideas looking for builders. Vote, comment, or turn one into a project.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
            <Plus size={15} />
            Post Idea
          </button>
        </div>

        {/* Ideas list */}
        <div className="space-y-4">
          {sampleIdeas.map((idea) => (
            <div key={idea.title} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300"
              style={{ border: `1px solid ${idea.color}18` }}>
              <div className="flex items-start gap-4">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: `${idea.color}12`, border: `1px solid ${idea.color}22` }}>
                    <ThumbsUp size={13} style={{ color: idea.color }} />
                  </button>
                  <span className="text-xs font-bold" style={{ color: idea.color }}>{idea.votes}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {idea.hot && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <Zap size={9} /> Hot
                      </span>
                    )}
                    <span className="text-sm font-semibold text-white">{idea.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(100,116,139,0.85)' }}>{idea.desc}</p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {idea.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${idea.color}09`, color: idea.color, border: `1px solid ${idea.color}18` }}>
                        {t}
                      </span>
                    ))}
                    <div className="ml-auto flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
                        <MessageSquare size={11} />
                        {idea.comments}
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(100,116,139,0.5)' }}>by {idea.author}</span>
                      <button className="text-xs px-3 py-1 rounded-lg font-medium transition-all hover:scale-105"
                        style={{ background: `${idea.color}12`, color: idea.color, border: `1px solid ${idea.color}20` }}>
                        Build it <ArrowRight size={10} className="inline ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post your own idea CTA */}
        <div className="mt-8 rounded-2xl p-8 text-center"
          style={{ background: 'rgba(16,185,129,0.04)', border: '1px dashed rgba(16,185,129,0.15)' }}>
          <Lightbulb size={26} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-400 mb-1">Have an idea bouncing around?</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(100,116,139,0.6)' }}>
            Post it here. The right builder will find it.
          </p>
          <button className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
            <Plus size={14} />
            Post an Idea
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
