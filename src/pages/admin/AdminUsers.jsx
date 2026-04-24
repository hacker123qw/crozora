import { AdminLayout } from '@/pages/admin/AdminDashboard';

const users = [
  { id: 1, name: 'Alex Johnson', email: 'alex@tuneteachers.com', business: 'TuneTeachers', plan: 'Verified Badge', joined: 'Feb 2026', status: 'Active' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@metrodental.com', business: 'Metro Dental Studio', plan: 'Verified Badge', joined: 'Jan 2026', status: 'Active' },
  { id: 3, name: 'Marcus Webb', email: 'marcus@quickfixelec.com', business: 'QuickFix Electronics', plan: 'Trust Report', joined: 'Mar 2026', status: 'Suspended' },
  { id: 4, name: 'Lisa Park', email: 'lisa@greenleafland.com', business: 'GreenLeaf Landscaping', plan: 'Free', joined: 'Apr 2026', status: 'Active' },
  { id: 5, name: 'James Okafor', email: 'james@sunroofinc.com', business: 'SunRoof Installers', plan: 'Trust Report', joined: 'Jan 2026', status: 'Suspended' },
];

export default function AdminUsers() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space text-white">Users & Accounts</h1>
        <p className="text-slate-500 text-sm mt-1">{users.length} registered accounts</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: 'rgba(59,130,246,0.04)' }}>
                {['User', 'Business', 'Plan', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-300">{user.business}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: 'rgba(59,130,246,0.1)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59,130,246,0.2)'
                    }}>{user.plan}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{user.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'status-active' : 'status-suspended'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
                      <button className="text-xs text-amber-400 hover:text-amber-300">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}