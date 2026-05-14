import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';

export default function CrozoraNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Ecosystem', path: '/#ecosystem' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Discover', path: '/#discover' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(5, 11, 24, 0.88)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.08)',
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
          }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-space font-bold text-xl tracking-tight">Crozora</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: isActive(link.path) ? '#60a5fa' : 'rgba(148,163,184,0.85)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'rgba(148,163,184,0.8)' }}>
            Sign In
          </Link>
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            Sign Up
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <button
            onClick={() => { navigate('/signup'); setMenuOpen(false); }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}