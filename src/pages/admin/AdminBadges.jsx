import { useState } from 'react';
import { AdminLayout } from '@/pages/admin/AdminDashboard';

const initialBadges = [
  { id: 1, business: 'Metro Dental Studio', website: 'metrodental.com', status: 'Active', since: 'Jan 2026' },
  { id: 2, business: 'TuneTeachers', website: 'tuneteachers.com', status: 'Active', since: 'Mar 2026' },
  { id: 3, business: 'ClearPath Legal', website: 'clearpathlegal.com', status: 'Expired', since: 'Oct 2025' },
  { id: 4, business: 'QuickFix Electronics', website: 'quickfixelec.com', status: 'Suspended', since: 'Feb 2026' },
  { id: 5, business: 'BlueSky Plumbing', website: 'blueskyplumb.com', status: 'Revoked', since: 'Dec 2025' },
];

export default function AdminBadges() {
  const [badges, setBadges] = useState(initialBadges);

  const updateStatus = (id, status) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space text-white">Badge Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage active, expired, suspended, and revoked badges</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {['Active', 'Expired', 'Suspended', 'Revoked'].map(status => (
          <div key={status} className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold font-space text-white mb-1">
              {badges.filter(b => b.status === status).length}
            </div>
            <div className={`text-xs font-medium ${
              status === 'Active' ? 'text-emerald-400' :
              status === 'Expired' ? 'text-red-400' :
              status === 'Suspended' ? 'text-amber-400' :
              'text-slate-500'
            }`}>{status}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: 'rgba(59,130,246,0.04)' }}>
                {['Business', 'Status', 'Since', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {badges.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{b.business}</p>
                    <p className="text-xs text-slate-500">{b.website}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.status === 'Active' ? 'status-active' :
                      b.status === 'Expired' || b.status === 'Suspended' ? 'status-expired' :
                      'text-slate-500'
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{b.since}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {b.status !== 'Suspended' && b.status !== 'Revoked' && (
                        <button onClick={() => updateStatus(b.id, 'Suspended')}
                          className="px-2.5 py-1 rounded-lg text-xs text-amber-400 hover:bg-amber-400/10"
                          style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
                          Suspend
                        </button>
                      )}
                      {(b.status === 'Suspended' || b.status === 'Expired') && (
                        <button onClick={() => updateStatus(b.id, 'Active')}
                          className="px-2.5 py-1 rounded-lg text-xs text-emerald-400 hover:bg-emerald-400/10"
                          style={{ border: '1px solid rgba(16,185,129,0.25)' }}>
                          Reactivate
                        </button>
                      )}
                      {b.status !== 'Revoked' && (
                        <button onClick={() => updateStatus(b.id, 'Revoked')}
                          className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-400/10"
                          style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
                          Revoke
                        </button>
                      )}
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