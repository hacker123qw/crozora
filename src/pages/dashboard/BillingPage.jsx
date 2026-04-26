import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Download } from 'lucide-react';

const invoices = [
  { id: 'INV-001', date: 'April 1, 2026', amount: '$19.00', plan: 'Verified Badge', status: 'Paid' },
  { id: 'INV-002', date: 'March 1, 2026', amount: '$19.00', plan: 'Verified Badge', status: 'Paid' },
  { id: 'INV-003', date: 'Feb 5, 2026', amount: '$29.00', plan: 'Trust Report', status: 'Paid' },
];

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Billing</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Current plan */}
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <h3 className="text-white font-bold font-space mb-4">Current Plan</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold">Verified Badge</p>
              <p className="text-sm text-slate-500">$19/month — renews May 1, 2026</p>
            </div>
            <div className="status-active px-3 py-1 rounded-full text-xs font-medium">Active</div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Manage Plan
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Payment method */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold font-space mb-4">Payment Method</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <CreditCard size={20} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Visa ending in 4242</p>
              <p className="text-xs text-slate-500">Expires 12/2027</p>
            </div>
            <button className="ml-auto text-xs text-blue-400 hover:text-blue-300">Update</button>
          </div>
        </div>

        {/* Plans */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold font-space mb-4">Available Plans</h3>
          <div className="space-y-3">
            {[
              { name: 'Free Trust Check', price: '$0', desc: 'Limited preview, simple result' },
              { name: 'One-Time Verification', price: '$30', desc: 'Advanced one-site report + badge if approved', oneTime: true },
              { name: 'Verified Badge', price: '$19/mo', desc: 'Live badge + public trust page', active: true },
            ].map(({ name, price, desc, active }) => (
              <div key={name} className="flex items-center justify-between p-4 rounded-xl" style={{
                background: active ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.03)',
                border: active ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(59,130,246,0.08)',
              }}>
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    {name}
                    {active && <span className="text-xs text-blue-400">(Current)</span>}
                  </p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{price}</p>
                  {!active && <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">Upgrade</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice history */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold font-space mb-4">Invoice History</h3>
          <div className="space-y-2">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div>
                  <p className="text-sm text-white font-medium">{inv.plan}</p>
                  <p className="text-xs text-slate-500">{inv.date} · {inv.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{inv.amount}</span>
                  <span className="status-active px-2 py-0.5 rounded-full text-xs">{inv.status}</span>
                  <button className="text-slate-500 hover:text-slate-400"><Download size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
