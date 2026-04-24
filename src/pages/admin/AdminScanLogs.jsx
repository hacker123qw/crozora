import { AdminLayout } from '@/pages/admin/AdminDashboard';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const logs = [
  { business: 'GreenLeaf Landscaping', check: 'HTTPS Check', result: 'Pass', time: '2026-04-21 09:14' },
  { business: 'GreenLeaf Landscaping', check: 'Policy Check', result: 'Pass', time: '2026-04-21 09:14' },
  { business: 'GreenLeaf Landscaping', check: 'Contact Info Check', result: 'Pass', time: '2026-04-21 09:15' },
  { business: 'GreenLeaf Landscaping', check: 'DNS Verification', result: 'Pass', time: '2026-04-21 09:15' },
  { business: 'GreenLeaf Landscaping', check: 'Review Signal Check', result: 'Needs Review', time: '2026-04-21 09:15' },
  { business: 'QuickFix Electronics', check: 'HTTPS Check', result: 'Pass', time: '2026-04-21 08:52' },
  { business: 'QuickFix Electronics', check: 'Policy Check', result: 'Fail', time: '2026-04-21 08:52' },
  { business: 'QuickFix Electronics', check: 'Contact Info Check', result: 'Needs Review', time: '2026-04-21 08:53' },
  { business: 'SunRoof Installers', check: 'HTTPS Check', result: 'Fail', time: '2026-04-21 07:31' },
  { business: 'SunRoof Installers', check: 'DNS Verification', result: 'Pass', time: '2026-04-21 07:31' },
  { business: 'SunRoof Installers', check: 'Scam Risk Check', result: 'Fail', time: '2026-04-21 07:32' },
];

export default function AdminScanLogs() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space text-white">Scan Logs</h1>
        <p className="text-slate-500 text-sm mt-1">Detailed results for all trust scan checks</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: 'rgba(59,130,246,0.04)' }}>
                {['Business', 'Check', 'Result', 'Timestamp'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}>
                  <td className="px-5 py-3 text-sm text-white">{log.business}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{log.check}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {log.result === 'Pass' ? <CheckCircle size={13} className="text-emerald-400" /> :
                       log.result === 'Fail' ? <XCircle size={13} className="text-red-400" /> :
                       <AlertCircle size={13} className="text-amber-400" />}
                      <span className="text-xs font-medium" style={{ color: log.result === 'Pass' ? '#34d399' : log.result === 'Fail' ? '#f87171' : '#fbbf24' }}>
                        {log.result}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 font-mono">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}