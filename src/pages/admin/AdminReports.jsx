import { AdminLayout } from '@/pages/admin/AdminDashboard';

const reports = [
  { id: 1, business: 'QuickFix Electronics', reason: 'Badge appears on site but business had poor service', date: '2026-04-20', status: 'Open' },
  { id: 2, business: 'SunRoof Installers', reason: 'Business is listed as verified but has multiple unresolved complaints', date: '2026-04-19', status: 'Under Review' },
  { id: 3, business: 'BlueSky Plumbing', reason: 'Badge link leads to incorrect verification page', date: '2026-04-18', status: 'Resolved' },
  { id: 4, business: 'FastTax Services', reason: 'Business no longer operating but badge still active', date: '2026-04-17', status: 'Open' },
];

export default function AdminReports() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space text-white">Reports & Complaints</h1>
        <p className="text-slate-500 text-sm mt-1">Customer-submitted badge and business complaints</p>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{report.business}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'Resolved' ? 'status-active' :
                    report.status === 'Under Review' ? 'status-pending' :
                    'status-expired'
                  }`}>{report.status}</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{report.reason}</p>
                <p className="text-xs text-slate-600">Reported: {report.date}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1.5 rounded-lg text-xs text-blue-400 hover:bg-blue-400/10"
                  style={{ border: '1px solid rgba(59,130,246,0.2)' }}>Review</button>
                <button className="px-3 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-400/10"
                  style={{ border: '1px solid rgba(16,185,129,0.2)' }}>Resolve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}