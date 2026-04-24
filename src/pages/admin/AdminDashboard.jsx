import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ClipboardList, ScanLine, Award, AlertTriangle, Users, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: ClipboardList, label: 'Review Queue', path: '/admin/reviews' },
  { icon: ScanLine, label: 'Scan Logs', path: '/admin/scan-logs' },
  { icon: Award, label: 'Badge Management', path: '/admin/badges' },
  { icon: AlertTriangle, label: 'Reports', path: '/admin/reports' },
  { icon: Users, label: 'Users', path: '/admin/users' },
];

const stats = [
  { label: 'Total Businesses', value: '847', delta: '+23 this week' },
  { label: 'Pending Reviews', value: '14', delta: '3 urgent', urgent: true },
  { label: 'Verified Badges', value: '312', delta: '+8 this month' },
  { label: 'Failed Scans', value: '89', delta: '10.5% fail rate' },
  { label: 'Reported Issues', value: '6', delta: '2 unresolved', urgent: true },
];

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (p) => location.pathname === p;

  return (
    <div className="min-h-screen flex" style={{ background: '#050b18' }}>
      {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-60 flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#080f1f', borderRight: '1px solid rgba(239,68,68,0.1)' }}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
              <Shield size={12} className="text-red-400" />
            </div>
            <span className="text-white font-space font-bold text-sm">Admin Panel</span>
          </div>
          <button className="md:hidden text-slate-500" onClick={() => setOpen(false)}><X size={16} /></button>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={`sidebar-item ${isActive(path) ? 'active' : ''}`}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ borderTop: '1px solid rgba(239,68,68,0.1)' }}>
          <button onClick={() => navigate('/')} className="sidebar-item w-full"><LogOut size={15} /> Exit Admin</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 flex items-center gap-4 md:hidden" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)', background: '#080f1f' }}>
          <button onClick={() => setOpen(true)} className="text-slate-400"><Menu size={20} /></button>
          <span className="text-white font-bold font-space text-sm">Crozora Admin</span>
          <span className="ml-auto text-xs text-red-400 font-medium px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)' }}>Admin</span>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space text-white">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Platform health and activity summary</p>
        </div>
        <span className="text-xs text-red-400 font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>Admin Access</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, delta, urgent }) => (
          <div key={label} className="glass-card rounded-xl p-5" style={urgent ? { border: '1px solid rgba(239,68,68,0.2)' } : {}}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-bold font-space text-white mb-1">{value}</p>
            <p className="text-xs" style={{ color: urgent ? '#f87171' : 'rgba(100,116,139,0.7)' }}>{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New business submitted', name: 'GreenLeaf Landscaping', time: '5 min ago', color: '#60a5fa' },
              { action: 'Badge approved', name: 'Metro Dental Studio', time: '42 min ago', color: '#34d399' },
              { action: 'Scan completed', name: 'SwiftCourier LLC', time: '1 hr ago', color: '#818cf8' },
              { action: 'Badge suspended', name: 'QuickFix Electronics', time: '3 hr ago', color: '#f87171' },
              { action: 'Issue reported', name: 'SunRoof Installers', time: '5 hr ago', color: '#fbbf24' },
            ].map(({ action, name, time, color }) => (
              <div key={name} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{name}</p>
                  <p className="text-xs text-slate-500">{action}</p>
                </div>
                <span className="text-xs text-slate-600 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <div className="space-y-2">
            {navItems.slice(1).map(({ icon: Icon, label, path }) => (
              <Link key={path} to={path} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-blue-500/5"
                style={{ border: '1px solid rgba(59,130,246,0.08)' }}>
                <Icon size={15} className="text-blue-400" />
                <span className="text-sm text-slate-300">{label}</span>
                <span className="ml-auto text-blue-400 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export { AdminLayout };