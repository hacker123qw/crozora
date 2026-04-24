import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Copy, CheckCircle, HelpCircle } from 'lucide-react';

const platforms = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'GoDaddy', 'Webflow', 'Custom HTML', "Not sure"];

const scriptCode = `<script src="https://crozora.com/badge.js" data-business-id="your-id"></script>`;
const imageCode = `<a href="https://crozora.com/verify/your-business" target="_blank">
  <img src="https://crozora.com/badge/your-business.svg" alt="Crozora Verified">
</a>`;

const platformInstructions = {
  'Wix': ['Open your Wix Editor', 'Click Add → More → HTML Embed', 'Paste the script code into the embed block', 'Position the badge where you want it on your page', 'Click Publish'],
  'WordPress': ['Log in to your WordPress admin', 'Go to Appearance → Theme Editor (or use "Insert Headers and Footers" plugin)', 'Paste the script before </body>', 'Save and clear your cache'],
  'Shopify': ['Go to Online Store → Themes → Edit Code', 'Open theme.liquid', 'Paste the script before </body>', 'Save and preview your store'],
  'Squarespace': ['Edit your page in Squarespace', 'Add a Code Block where you want the badge', 'Paste the badge code into the block', 'Apply and publish'],
  'GoDaddy': ['Open your GoDaddy website editor', 'Add an HTML section to your page', 'Paste the badge code', 'Publish changes'],
  'Webflow': ['Open your Webflow project', 'Add an Embed element to your page', 'Paste the script code', 'Publish your site'],
};

const getInstructions = (platform) => platformInstructions[platform] || [
  `Log in to your website builder or CMS`,
  'Find the HTML or code editor section',
  'Paste the badge script before the closing </body> tag',
  'Save and publish your changes',
  'Visit your live site to confirm the badge appears',
];

export default function BadgeSetupPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="text-blue-400 font-semibold">Step 4</span>
          <span>/ 4</span>
        </div>
        <h1 className="text-3xl font-bold font-space text-white">Install Your Verified Badge</h1>
        <p className="text-slate-400 text-sm mt-2">Add the Crozora badge to your website so customers can see you're verified.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Badge preview */}
        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <VerifiedBadge size="lg" />
          <div>
            <p className="text-white font-semibold text-sm mb-1">Your Verified Badge</p>
            <p className="text-xs text-slate-400">This badge links to your public verification page where customers can confirm your trust status.</p>
          </div>
        </div>

        {/* Platform selector */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">What platform is your website on?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className="py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-all"
                style={{
                  background: selectedPlatform === p ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.04)',
                  border: selectedPlatform === p ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                  color: selectedPlatform === p ? '#60a5fa' : 'rgba(148,163,184,0.6)',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {selectedPlatform && (
            selectedPlatform === 'Not sure' ? (
              <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <HelpCircle size={22} className="text-blue-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-sm mb-1">No problem — we'll help you.</p>
                <p className="text-xs text-slate-500 mb-4">Contact us and our team will walk you through installing your badge.</p>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                  Request Setup Help
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <p className="text-sm font-semibold text-white mb-3">{selectedPlatform} — Installation steps</p>
                <ol className="space-y-2">
                  {getInstructions(selectedPlatform).map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-xs font-bold text-blue-400 mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                      <span className="text-sm text-slate-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )
          )}
        </div>

        {/* Code blocks */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm">Badge Code</h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">Script Badge (recommended)</p>
              <button
                onClick={() => handleCopy('script', scriptCode)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg transition-all"
                style={{ background: 'rgba(59,130,246,0.08)' }}
              >
                {copied === 'script' ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
            <div className="rounded-lg p-3 font-mono text-xs overflow-x-auto" style={{ background: '#030712', border: '1px solid rgba(59,130,246,0.1)', color: '#93c5fd' }}>
              {scriptCode}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-medium">Image Link Badge</p>
              <button
                onClick={() => handleCopy('image', imageCode)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg transition-all"
                style={{ background: 'rgba(59,130,246,0.08)' }}
              >
                {copied === 'image' ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
            <div className="rounded-lg p-3 font-mono text-xs overflow-x-auto" style={{ background: '#030712', border: '1px solid rgba(59,130,246,0.1)', color: '#93c5fd', whiteSpace: 'pre' }}>
              {imageCode}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}