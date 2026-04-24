import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, PlusCircle, Globe, ScanLine, FileText,
  Award, Eye, CreditCard, Settings, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: PlusCircle, label: 'Step 1: Enter URL', path: '/dashboard/add-business' },
  { icon: Globe, label: 'Step 2: Verify Domain', path: '/dashboard/ownership' },
  { icon: ScanLine, label: 'Step 3: Trust Scan', path: '/dashboard/scan' },
  { icon: FileText, label: 'Private Report', path: '/dashboard/report' },
  { icon: Award, label: 'Step 4: Get Badge', path: '/dashboard/badge' },
  { icon: Eye, label: 'Public Trust Page', path: '/dashboard/public-preview' },
  { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: '#050b18' }}>
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#080f1f', borderRight: '1px solid rgba(59,130,246,0.1)' }}>

        {/* Logo */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            }}>
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-white font-space font-bold text-lg">Crozora</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Business info */}
        <div className="px-4 py-4 mx-3 my-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <p className="text-xs text-slate-500 mb-0.5">Current Business</p>
          <p className="text-sm font-semibold text-slate-400 italic">No business added yet</p>
          <p className="text-xs text-slate-600 mt-0.5">Start with Step 1 →</p>
        </div>

        {/* Nav */}
        <nav className="px-3 py-2 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${isActive(path) ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <button
            onClick={() => navigate('/')}
            className="sidebar-item w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="px-6 py-4 flex items-center gap-4 md:hidden" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: '#080f1f' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400">
            <Menu size={22} />
          </button>
          <span className="text-white font-bold font-space">Dashboard</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}