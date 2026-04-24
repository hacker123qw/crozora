import { Globe, CheckCircle, Award, Eye, Plus, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const PRO_SITES = [
  { domain: 'tuneteachers.com',    name: 'TuneTeachers',        ownership: 'Verified', preview: 'Passed',      badge: 'Active',   page: 'Active',     checked: 'Apr 2026', builder: 'WordPress' },
  { domain: 'examplecleaning.com', name: 'Example Cleaning Co', ownership: 'Verified', preview: 'Needs work',  badge: 'No badge', page: 'Not active', checked: 'Apr 2026', builder: 'Wix' },
  { domain: 'samplecoach.com',     name: 'Sample Coach',        ownership: 'Pending',  preview: 'Not scanned', badge: 'No badge', page: 'Not active', checked: '—',        builder: 'Squarespace' },
];

function AddSiteModal({ onClose, isPro }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-5"
        style={{ border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-space text-white">Add Another Website</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={18} /></button>
        </div>
        {isPro ? (
          <>
            <p className="text-sm text-slate-400">Enter the domain you want to add to your Crozora Pro account.</p>
            <input type="text" placeholder="newsite.com" className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }} />
            <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Start Setup for This Site
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-400">Additional websites require another one-time verification or Crozora Pro.</p>
            <div className="space-y-3">
              <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                Verify Another Website — $30
              </button>
              <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.7)' }}>
                Start Crozora Pro — $20/month
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashWebsites({ biz, status }) {
  const [showModal, setShowModal] = useState(false);
  const isPro = status === 'pro' || status === 'approved';
  const domain = biz.url || 'tuneteachers.com';
  const name = biz.name || domain;

  const badgeCls = (b) => b === 'Active' ? 'status-active' : 'status-expired';
  const ownerCls = (o) => o === 'Verified' ? 'status-active' : 'status-pending';

  return (
    <div className="space-y-6">
      {showModal && <AddSiteModal onClose={() => setShowModal(false)} isPro={isPro} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space text-white">Websites</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isPro ? 'All websites under your Crozora Pro account.' : `Coverage for one website — ${domain}.`}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Plus size={14} /> Add Website
        </button>
      </div>

      {!isPro && (
        <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(251,191,36,0.8)' }}>
          <strong className="text-amber-300">One website covered:</strong> This one-time verification applies only to <span className="font-mono">{domain}</span>. Additional websites require another $30 one-time verification or Crozora Pro.
        </div>
      )}

      {isPro ? (
        /* Pro: table */
        <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  {['Website', 'Ownership', 'Trust Preview', 'Badge Status', 'Public Page', 'Last Checked', 'Next Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRO_SITES.map(s => (
                  <tr key={s.domain} className="hover:bg-blue-500/3 transition-colors" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                    <td className="px-4 py-3">
                      <p className="font-mono text-blue-300 text-xs">{s.domain}</p>
                      <p className="text-slate-500 text-xs">{s.name}</p>
                    </td>
                    <td className="px-4 py-3"><span className={`${ownerCls(s.ownership)} px-2 py-0.5 rounded-full text-xs`}>{s.ownership}</span></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.preview}</td>
                    <td className="px-4 py-3"><span className={`${badgeCls(s.badge)} px-2 py-0.5 rounded-full text-xs`}>{s.badge}</span></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.page}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{s.checked}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        {s.ownership === 'Pending' ? 'Complete DNS' : s.badge === 'Active' ? 'Manage Badge' : 'View Report'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Free/One-time: single site card */
        <div className="glass-card rounded-2xl p-6 max-w-lg" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
              {(name[0] || 'T').toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold">{name}</p>
              <p className="text-xs font-mono text-slate-500">{domain}</p>
            </div>
            <span className="ml-auto text-xs status-active px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="space-y-2">
            {[
              { icon: Globe,    label: 'Ownership',    val: 'Verified', cls: 'status-active' },
              { icon: CheckCircle, label: 'Trust Preview', val: 'Complete', cls: 'status-active' },
              { icon: Globe,    label: 'Plan Coverage', val: status === 'free' ? 'Free Preview' : `${domain} only`, cls: status === 'free' ? 'status-pending' : 'status-active' },
              { icon: Award,    label: 'Badge Status',  val: status === 'approved' ? 'Approved' : status === 'free' ? 'Not available' : 'Pending review', cls: status === 'approved' ? 'status-active' : status === 'free' ? 'status-expired' : 'status-pending' },
            ].map(({ icon: Icon, label, val, cls }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}