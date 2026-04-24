import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Globe, Bell, Lock, Trash2, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'business', label: 'Business Profile', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold font-space text-white">Settings</h1>
      </div>

      <div className="max-w-2xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-all"
              style={{
                background: activeTab === id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: activeTab === id ? '#60a5fa' : 'rgba(148,163,184,0.7)',
              }}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'account' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold mb-2">Account Details</h3>
            {[
              { label: 'Full Name', value: 'Alex Johnson' },
              { label: 'Email Address', value: 'alex@tuneteachers.com' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input defaultValue={value} className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }} />
              </div>
            ))}
            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white mt-2"
              style={{ background: saved ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold mb-2">Business Profile</h3>
            {[
              { label: 'Business Name', value: 'TuneTeachers' },
              { label: 'Website URL', value: 'tuneteachers.com' },
              { label: 'Business Email', value: 'contact@tuneteachers.com' },
              { label: 'Service Area', value: 'Online / United States' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input defaultValue={value} className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }} />
              </div>
            ))}
            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: saved ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold mb-2">Notification Preferences</h3>
            {[
              'Badge status changes',
              'Monthly recheck alerts',
              'Verification expiry warnings',
              'Customer issue reports',
              'Platform updates',
            ].map((item) => (
              <div key={item} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <span className="text-sm text-slate-300">{item}</span>
                <div className="w-10 h-5 rounded-full relative cursor-pointer" style={{ background: 'rgba(59,130,246,0.3)' }}>
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-blue-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold mb-2">Change Password</h3>
              {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                <div key={f}>
                  <label className="text-xs text-slate-500 mb-1 block">{f}</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/40"
                    style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }} />
                </div>
              ))}
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                Update Password
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
              <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><Trash2 size={15} /> Delete Account</h3>
              <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
                style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}