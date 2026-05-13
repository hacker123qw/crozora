import { useNavigate } from 'react-router-dom';
import CrozoraNav from '@/components/CrozoraNav';
import CrozoraFooter from '@/components/CrozoraFooter';
import {
  ArrowRight, Zap, Users, FolderOpen, Bot, Store, Lightbulb,
  Radio, Compass, ChevronRight, Globe, Code2, Palette, Rocket,
  MessageSquare, BarChart3
} from 'lucide-react';

const ecosystemPillars = [
  {
    icon: UserCircle2,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    title: 'Builder Profiles',
    desc: 'Your identity, skills, projects, and momentum in one place. Not a resume — a builder identity.',
  },
  {
    icon: FolderOpen,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.15)',
    title: 'Live Project Spaces',
    desc: 'Turn ideas into active projects. Share progress, attract collaborators, and keep momentum.',
  },
  {
    icon: Bot,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
    title: 'AI Co-Builder',
    desc: 'An AI layer woven throughout the ecosystem to help you brainstorm, summarize, and move faster.',
  },
  {
    icon: Compass,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    title: 'Discover Builders',
    desc: 'Find collaborators without forced networking. Intelligent opportunity discovery, not a job board.',
  },
  {
    icon: Radio,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    title: 'Build Rooms',
    desc: 'Live collaborative spaces for teams forming, brainstorming, and building together in real time.',
  },
  {
    icon: Store,
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
    title: 'Marketplace',
    desc: 'AI agents, prompts, templates, and builder tools. An ecosystem layer for serious builders.',
  },
];

const fragments = [
  { name: 'Discussion', tool: 'Forums', icon: MessageSquare },
  { name: 'Code', tool: 'Repositories', icon: Code2 },
  { name: 'Identity', tool: 'Professional Networks', icon: Globe },
  { name: 'AI Help', tool: 'Individual Chatbots', icon: Bot },
  { name: 'Design', tool: 'Design Tools', icon: Palette },
  { name: 'Launches', tool: 'Launch Platforms', icon: Rocket },
  { name: 'Organization', tool: 'Docs & Notes', icon: BarChart3 },
  { name: 'Community', tool: 'Chat Apps', icon: Users },
];

const roles = [
  { label: 'Developers', color: '#3b82f6' },
  { label: 'Designers', color: '#8b5cf6' },
  { label: 'Entrepreneurs', color: '#06b6d4' },
  { label: 'AI Builders', color: '#10b981' },
  { label: 'Indie Hackers', color: '#f59e0b' },
  { label: 'Creators', color: '#ec4899' },
];

function UserCircle2({ size = 20, className = '' }) {
  return <Users size={size} className={className} />;
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#050b18' }}>
      <CrozoraNav />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden grid-pattern" id="ecosystem">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 text-center relative">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            A new kind of builder ecosystem
          </div>

          <h1 className="text-5xl md:text-7xl font-space font-bold text-white leading-tight mb-8 max-w-5xl mx-auto">
            Where builders and{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AI create together.
            </span>
          </h1>

          <p className="text-xl leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: 'rgba(148,163,184,0.8)' }}>
            Crozora is a living ecosystem for entrepreneurs, developers, creators, and AI-native builders to meet, collaborate, form projects, and turn ideas into reality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 0 40px rgba(59,130,246,0.3)',
              }}>
              Enter Crozora
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-white/5"
              style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.9)' }}>
              Explore the Ecosystem
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Role chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {roles.map(({ label, color }) => (
              <span key={label} className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Hero visual — ecosystem preview card cluster */}
        <div className="max-w-5xl mx-auto px-6 mt-20 grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Active Projects', value: '2,400+', sub: 'building right now', color: '#3b82f6' },
            { title: 'Builders Online', value: '890', sub: 'in the ecosystem today', color: '#8b5cf6' },
            { title: 'Connections Made', value: '14k+', sub: 'collaborations formed', color: '#06b6d4' },
          ].map(({ title, value, sub, color }) => (
            <div key={title} className="glass-card rounded-2xl p-6 text-center"
              style={{ border: `1px solid ${color}20` }}>
              <div className="text-3xl font-space font-bold mb-1" style={{ color }}>{value}</div>
              <div className="text-xs font-medium text-white mb-1">{title}</div>
              <div className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The fragmentation problem ── */}
      <section className="py-28" style={{ background: 'rgba(8,15,31,0.9)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#8b5cf6' }}>The Problem</p>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-white mb-6">
              Builders are fragmented<br />across too many places.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Every part of the building journey lives in a different tool. You're context-switching all day instead of creating.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {fragments.map(({ name, tool, icon: Icon }) => (
              <div key={name} className="glass-card rounded-xl p-4 text-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <Icon size={20} className="mx-auto mb-3 text-slate-500" />
                <div className="text-xs font-semibold text-slate-300 mb-1">{name}</div>
                <div className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>{tool}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>
                Crozora combines the builder journey into one connected ecosystem.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem pillars ── */}
      <section className="py-28 grid-pattern" id="projects">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#06b6d4' }}>The Ecosystem</p>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-white mb-6">
              Everything a builder needs,<br />in one living place.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Not another forum. Not another chatbot. A connected ecosystem where your people, projects, and AI layer work together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ecosystemPillars.map(({ icon: Icon, color, glow, title, desc }) => (
              <div key={title}
                className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group"
                style={{ border: `1px solid ${color}18` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: glow, border: `1px solid ${color}25` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 font-space">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(100,116,139,0.85)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-28" style={{ background: 'rgba(8,15,31,0.95)' }} id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#10b981' }}>How Crozora Works</p>
            <h2 className="text-4xl font-space font-bold text-white mb-4">
              Your builder journey starts here.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                icon: UserCircle2,
                color: '#3b82f6',
                title: 'Create your builder profile',
                desc: 'Set your role, skills, what you\'re building, and what you\'re looking for. This is your identity in the ecosystem.',
              },
              {
                num: '02',
                icon: FolderOpen,
                color: '#8b5cf6',
                title: 'Start or join a project',
                desc: 'Launch an idea as a project. Post what skills you need. Builders discover you organically.',
              },
              {
                num: '03',
                icon: Compass,
                color: '#06b6d4',
                title: 'Discover your collaborators',
                desc: 'Find builders who complement your strengths. Connect without the awkward forced networking.',
              },
              {
                num: '04',
                icon: Rocket,
                color: '#10b981',
                title: 'Build and ship together',
                desc: 'Use Build Rooms, AI assistance, and momentum tracking to keep your project moving forward.',
              },
            ].map(({ num, icon: Icon, color, title, desc }) => (
              <div key={num} className="relative">
                <div className="glass-card rounded-2xl p-6">
                  <div className="text-xs font-mono mb-4 opacity-50" style={{ color }}>{num}</div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <h3 className="text-white font-semibold mb-2 font-space">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(100,116,139,0.8)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discover section ── */}
      <section className="py-28 grid-pattern" id="discover">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: '#f59e0b' }}>Builder Discovery</p>
              <h2 className="text-4xl font-space font-bold text-white mb-6">
                Find collaborators without forced networking.
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(148,163,184,0.75)' }}>
                Your builder identity and active projects surface you to the right people. Crozora's discovery layer connects builders based on what they're actually building — not just their job title.
              </p>
              <ul className="space-y-4">
                {[
                  'Intelligent project-to-builder matching',
                  'Skill gap discovery across your projects',
                  'Reputation and momentum signals',
                  'Open collaboration requests',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(148,163,184,0.85)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock builder cards */}
            <div className="space-y-3">
              {[
                { name: 'Alex Chen', role: 'Full-Stack Developer', skills: ['React', 'Node', 'AI'], focus: 'Building a fintech tool', color: '#3b82f6' },
                { name: 'Priya Nair', role: 'Product Designer', skills: ['Figma', 'UX', 'Systems'], focus: 'Redesigning SaaS onboarding', color: '#8b5cf6' },
                { name: 'Marcus Lee', role: 'AI Engineer', skills: ['Python', 'LLMs', 'APIs'], focus: 'Automating content workflows', color: '#06b6d4' },
              ].map(({ name, role, skills, focus, color }) => (
                <div key={name} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)` }}>
                    {name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{name}</span>
                      <span className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>· {role}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'rgba(100,116,139,0.8)' }}>{focus}</p>
                    <div className="flex gap-1.5">
                      {skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-space font-bold text-white mb-6">
            Your builder identity,<br />projects, and momentum<br />in one place.
          </h2>
          <p className="text-lg mb-12" style={{ color: 'rgba(148,163,184,0.7)' }}>
            Join builders who are turning ideas into active projects inside Crozora's ecosystem.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 0 50px rgba(59,130,246,0.3)',
              }}>
              Enter Crozora
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.8)' }}>
              Already a builder? Sign in
            </button>
          </div>
        </div>
      </section>

      <CrozoraFooter />
    </div>
  );
}
