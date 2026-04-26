import { useState } from 'react';
import { AdminLayout } from '@/pages/admin/AdminDashboard';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const initialBusinesses = [
  { id: 1, name: 'GreenLeaf Landscaping', website: 'greenleafland.com', scan: 'Pass', ownership: 'Verified', payment: 'Paid', review: 'Pending' },
  { id: 2, name: 'Metro Dental Studio', website: 'metrodental.com', scan: 'Pass', ownership: 'Verified', payment: 'Paid', review: 'Approved' },
  { id: 3, name: 'QuickFix Electronics', website: 'quickfixelec.com', scan: 'Needs Review', ownership: 'Pending', payment: 'Paid', review: 'Under Review' },
  { id: 4, name: 'SwiftCourier LLC', website: 'swiftcourier.io', scan: 'Pass', ownership: 'Verified', payment: 'Paid', review: 'Pending' },
  { id: 5, name: 'SunRoof Installers', website: 'sunroofinc.com', scan: 'Fail', ownership: 'Verified', payment: 'Unpaid', review: 'Rejected' },
];

export default function AdminReviewQueue() {
  const [businesses, setBusinesses] = useState(initialBusinesses);

  const updateReview = (id, status) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, review: status } : b));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space text-white">Manual Review Queue</h1>
        <p className="text-slate-500 text-sm mt-1">{businesses.filter(b => b.review === 'Pending').length} businesses awaiting review</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: 'rgba(59,130,246,0.04)' }}>
                {['Business', 'Scan Result', 'Ownership', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.website}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium" style={{ color: b.scan === 'Pass' ? '#34d399' : b.scan === 'Fail' ? '#f87171' : '#fbbf24' }}>
                      {b.scan}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium" style={{ color: b.ownership === 'Verified' ? '#34d399' : '#fbbf24' }}>
                      {b.ownership}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: b.payment === 'Paid' ? '#34d399' : '#f87171' }}>{b.payment}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.review === 'Approved' ? 'status-active' : b.review === 'Rejected' ? 'status-expired' : b.review === 'Under Review' ? 'status-pending' : 'text-slate-400'}`}>
                      {b.review}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {b.review === 'Pending' || b.review === 'Under Review' ? (
                      <div className="flex gap-2">
                        <button onClick={() => updateReview(b.id, 'Approved')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-400/10"
                          style={{ border: '1px solid rgba(16,185,129,0.25)' }}>
                          <CheckCircle size={11} /> Approve
                        </button>
                        <button onClick={() => updateReview(b.id, 'Rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10"
                          style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
                          <XCircle size={11} /> Reject
                        </button>
                        <button onClick={() => updateReview(b.id, 'Under Review')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-400 transition-colors hover:bg-amber-400/10"
                          style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
                          <AlertCircle size={11} /> Request Changes
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => updateReview(b.id, 'Pending')} className="text-xs text-slate-500 hover:text-slate-400">Reset</button>
                    )}
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
