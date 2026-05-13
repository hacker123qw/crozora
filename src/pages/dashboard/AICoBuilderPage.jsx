import DashboardLayout from '@/components/DashboardLayout';
import { Bot, Zap, ArrowRight, Lightbulb, Users, FileText, TrendingUp, Sparkles } from 'lucide-react';

const aiCapabilities = [
  {
    icon: Lightbulb,
    color: '#f59e0b',
    title: 'Brainstorm Ideas',
    desc: 'Describe a problem space and let the AI Co-Builder help you explore angles, validate assumptions, and scope the idea.',
  },
  {
    icon: FileText,
    color: '#3b82f6',
    title: 'Summarize Projects',
    desc: 'Drop in messy notes or conversation transcripts and get back a clean project brief, ready to share with collaborators.',
  },
  {
    icon: Users,
    color: '#8b5cf6',
    title: 'Recommend Collaborators',
    desc: 'Based on your project DNA, the AI surfaces builders in the ecosystem whose skills and focus align with your needs.',
  },
  {
    icon: TrendingUp,
    color: '#10b981',
    title: 'Track Momentum',
    desc: 'Check in with the AI weekly. It spots patterns, surfaces blockers, and keeps you honest about whether you\'re making real progress.',
  },
  {
    icon: Zap,
    color: '#06b6d4',
    title: 'Organize Next Steps',
    desc: 'Turn a brain dump into a prioritized action list. The AI understands builder context — not just generic task management.',
  },
  {
    icon: Sparkles,
    color: '#ec4899',
    title: 'Keep Builders Moving',
    desc: 'The AI Co-Builder is designed to eliminate the "I don\'t know what to do next" feeling that kills projects.',
  },
];

const samplePrompts = [
  'Help me scope my idea into an MVP',
  'Write a project brief I can share with potential co-founders',
  'What skills am I missing for this project?',
  'Summarize my last week\'s progress',
  'Help me find my first 10 users',
  'Give me 5 names for my project',
];

export default function AICoBuilderPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <Bot size={14} className="text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">AI Co-Builder</span>
          </div>
          <h1 className="text-2xl font-space font-bold text-white mb-2">Your AI building partner.</h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
            Not just a chatbot. An AI layer woven into the Crozora ecosystem — designed specifically for builders who are actively creating things.
          </p>
        </div>

        {/* Coming soon chat area */}
        <div className="rounded-2xl mb-10 overflow-hidden"
          style={{ border: '1px solid rgba(6,182,212,0.15)' }}>
          {/* Chat header */}
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ background: 'rgba(6,182,212,0.05)', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}>
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Co-Builder</p>
              <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>Crozora's builder-first AI assistant</p>
            </div>
            <span className="ml-auto text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
              Coming Soon
            </span>
          </div>

          {/* Chat body placeholder */}
          <div className="p-8 text-center" style={{ background: 'rgba(8,15,31,0.5)', minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={36} className="text-slate-700 mb-4" />
            <p className="text-sm font-medium text-slate-400 mb-1">The AI Co-Builder is being woven into Crozora.</p>
            <p className="text-xs mb-6" style={{ color: 'rgba(100,116,139,0.6)' }}>
              It will be deeply integrated with your profile, projects, and the ecosystem — not a standalone chatbot.
            </p>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
              Join AI waitlist
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Input area placeholder */}
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(6,182,212,0.03)', borderTop: '1px solid rgba(6,182,212,0.08)' }}>
            <div className="flex-1 px-4 py-2.5 rounded-xl text-sm text-slate-600 cursor-not-allowed"
              style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
              Ask your AI Co-Builder anything...
            </div>
            <button disabled className="w-9 h-9 rounded-xl flex items-center justify-center opacity-30 cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}>
              <ArrowRight size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Capabilities grid */}
        <h2 className="text-sm font-semibold text-white mb-5">What the AI Co-Builder will do</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {aiCapabilities.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card rounded-xl p-5" style={{ border: `1px solid ${color}14` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Sample prompts */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Sample prompts you'll use</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {samplePrompts.map(prompt => (
              <div key={prompt} className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-not-allowed opacity-60"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                <Zap size={12} className="text-violet-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{prompt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
