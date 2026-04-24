import { Shield, CheckCircle } from 'lucide-react';

export default function VerifiedBadge({ size = 'md', onClick }) {
  const sizes = {
    sm: { wrapper: 'px-3 py-1.5', icon: 12, text: 'text-xs', shield: 14 },
    md: { wrapper: 'px-4 py-2', icon: 14, text: 'text-sm', shield: 16 },
    lg: { wrapper: 'px-5 py-3', icon: 16, text: 'text-base', shield: 20 },
  };
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${s.wrapper}`}
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2444 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      }}>
        <Shield size={s.shield - 4} className="text-white" />
      </div>
      <div className="text-left">
        <div className={`${s.text} font-bold text-white leading-tight`}>Crozora Verified</div>
        <div className="text-xs" style={{ color: '#34d399', fontSize: '10px' }}>✓ Trust Checked</div>
      </div>
    </button>
  );
}