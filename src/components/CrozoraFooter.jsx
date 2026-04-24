import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function CrozoraFooter() {
  return (
    <footer style={{ background: '#030712', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              }}>
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white font-space font-bold text-xl">Crozora</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Trust verification for websites and local service businesses. Helping businesses prove credibility online.
            </p>
            <p className="text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
              © 2026 Crozora. All rights reserved.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                ['How It Works', '/how-it-works'],
                ['Pricing', '/pricing'],
                ['Trust Standards', '/trust-standards'],
                ['Run Free Trust Preview', '/signup'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm transition-colors hover:text-blue-400" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Support', '/contact'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-sm transition-colors hover:text-blue-400" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
                ['Terms of Service', '/terms'],
                ['Privacy Policy', '/privacy'],
                ['Disclaimer', '/disclaimer'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm transition-colors hover:text-blue-400" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(100,116,139,0.5)' }}>
            Crozora verification means a business passed Crozora's trust checks. It does not guarantee every customer experience.
          </p>
          <Link to="/verify/tuneteachers" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
            Sample Verification Page →
          </Link>
        </div>
      </div>
    </footer>
  );
}