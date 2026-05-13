import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  Zap, LayoutGrid, UserCircle, FolderOpen, Compass, Radio,
  Lightbulb, Bot, Store, MessageSquare, Settings, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { icon: LayoutGrid, label: 'Ecosystem Feed', path: '/dashboard/feed' },
  { icon: UserCircle, label: 'My Profile', path: '/dashboard/profile' },
  { icon: FolderOpen, label: 'Projects', path: '/dashboard/projects' },
  { icon: Compass, label: 'Discover Builders', path: '/dashboard/discover' },
  { icon: Radio, label: 'Build Rooms', path: '/dashboard/build-rooms' },
  { icon: Lightbulb, label: 'Ideas', path: '/dashboard/ideas' },
  { icon: Bot, label: 'AI Co-Builder', path: '/dashboard/ai' },
  { icon: Store, label: 'Marketplace', path: '/dashboard/marketplace' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages', soon: true },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: '#050b18' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#080f1f', borderRight: '1px solid rgba(59,130,246,0.08)' }}>

        {/* Logo */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-lg">Crozora</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Builder identity chip */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
          <p className="text-xs text-slate-500 mb-0.5">Builder</p>
          <p className="text-sm font-semibold text-slate-300 truncate">
            {user?.email?.split('@')[0] ?? 'Builder'}
          </p>
          <p className="text-xs text-violet-400 mt-0.5">Active in Crozora</p>
        </div>

        {/* Nav */}
        <nav className="px-3 py-2 flex flex-col gap-0.5">
          {navItems.map(({ icon: Icon, label, path, soon }) => (
            <Link
              key={path}
              to={soon ? '#' : path}
              onClick={() => !soon && setSidebarOpen(false)}
              className={`sidebar-item ${isActive(path) ? 'active' : ''} ${soon ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Icon size={16} />
              {label}
              {soon && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: '10px' }}>
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
          <button onClick={() => logout()} className="sidebar-item w-full">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="px-6 py-4 flex items-center gap-4 md:hidden" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)', background: '#080f1f' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400">
            <Menu size={22} />
          </button>
          <span className="text-white font-bold font-space">Crozora</span>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
