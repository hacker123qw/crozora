import { useMemo, useState } from 'react';
import { Lock, CheckCircle, AlertTriangle, XCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { createSiteReport } from '@/services/reports';
import { createTrustScan, runPaidReportScan, updateTrustScan } from '@/services/trustScans';
import { updateWebsiteById } from '@/services/websites';
import { ensureBadgeForWebsite, updateBadgeById } from '@/services/badges';

function formatDate(value, fallback = 'Not scheduled') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function SectionBlock({ title, items, color, icon: Icon }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Icon size={13} style={{ color }} /> {title}
        </h3>
        <span className="text-xs font-bold" style={{ color }}>{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-start gap-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
            <span className="text-sm text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapRecommendationText(recommendation) {
  if (typeof recommendation === 'string') return recommendation;
  if (recommendation?.title && recommendation?.detail) return `${recommendation.title}: ${recommendation.detail}`;
  return recommendation?.detail || recommendation?.title || 'Recommendation available';
}

function flattenSectionFindings(sections = []) {
  const flattened = [];

  sections.forEach((section) => {
    if (Array.isArray(section.findings)) {
      section.findings.forEach((finding) => {
        flattened.push({
          section: section.title,
          sectionStatus: section.status || section.severity || '',
          type: finding.type || '',
          page: finding.page,
          issue: finding.issue || finding.label || finding.detail || 'Finding available',
          why: finding.why_it_matters || finding.why || '',
          fix: finding.suggested_fix || finding.fix || '',
        });
      });
      return;
    }

    if (Array.isArray(section.content?.findings)) {
      section.content.findings.forEach((finding) => {
        flattened.push({
          section: section.title,
          sectionStatus: section.status || section.severity || '',
          type: finding.type || '',
          page: finding.page,
          issue: finding.issue || finding.label || finding.detail || 'Finding available',
          why: finding.why_it_matters || finding.why || '',
          fix: finding.suggested_fix || finding.fix || '',
        });
      });
    }
  });

  const seen = new Set();
  return flattened.filter((item) => {
    const key = `${String(item.section || '').toLowerCase()}|${String(item.issue || '').toLowerCase()}|${String(item.page || '').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function classifyFindingBucket(finding) {
  const issue = String(finding.issue || '').toLowerCase();
  const type = String(finding.type || '').toLowerCase();
  const sectionStatus = String(finding.sectionStatus || '').toLowerCase();

  const clearlyPassed = [
    'was detected',
    'is complete',
    'is enabled',
    'returned a successful response',
    'is on file',
    'found',
  ].some((pattern) => issue.includes(pattern))
    && !['missing', 'not ', 'failed', 'needs', 'still needed'].some((bad) => issue.includes(bad));

  const criticalFailure = [
    'not reachable',
    'failed',
    'broken',
    'parked domain',
    'could not get a healthy response',
  ].some((pattern) => issue.includes(pattern));

  const attentionIssue = [
    'missing',
    'not detected',
    'not enabled',
    'still needed',
    'should be completed',
    'not visible',
    'needs',
    'questionable',
  ].some((pattern) => issue.includes(pattern));

  if (type === 'passed' || sectionStatus === 'passed' || clearlyPassed) return 'passed';
  if (type === 'risk' || criticalFailure) return 'failed';
  if (type === 'attention' || sectionStatus.includes('needs_') || sectionStatus === 'warning' || attentionIssue) return 'attention';
  return 'attention';
}

function summarizeFindings(findings = []) {
  const passed = [];
  const attention = [];
  const failed = [];

  findings.forEach((finding) => {
    const label = finding.issue || finding.label || finding.detail || 'Finding available';
    const pageSuffix = finding.page ? ` (${finding.page})` : '';
    const text = `${label}${pageSuffix}`;
    const bucket = classifyFindingBucket(finding);
    if (bucket === 'passed') passed.push(text);
    else if (bucket === 'failed') failed.push(text);
    else attention.push(text);
  });

  return { passed, attention, failed };
}

export default function DashReport({ biz, status, setSection }) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState('');
  const [localReport, setLocalReport] = useState(null);
  const [localScan, setLocalScan] = useState(null);
  const [localStatus, setLocalStatus] = useState('');

  const domain = biz.url || 'your website';
  const activeEntitlementType = biz.activeEntitlement?.entitlement_type || biz.effectiveEntitlement?.entitlement_type || null;
  const isProAccess = activeEntitlementType === 'pro' || status === 'pro';
  const isOneTimeAccess = activeEntitlementType === 'one_time_site' || status === 'onetime' || status === 'approved' || status === 'not_approved';
  const hasActivePaidEntitlement = activeEntitlementType === 'pro' || activeEntitlementType === 'one_time_site';
  const accessLevel = isProAccess || isOneTimeAccess ? 'advanced' : 'free';
  const effectiveReport = localReport || biz.latestReport;
  const effectiveScan = localScan || biz.latestScan;
  const effectiveStatus = localStatus || biz.verificationStatus || status;

  const freeSummary = effectiveReport?.summary || 'Your free preview is complete, and your stored summary is ready below.';
  const freeResult = biz.previewResult === 'looks_promising'
    ? 'Looks promising'
    : biz.previewResult === 'needs_improvement'
    ? 'Needs improvement'
    : biz.previewResult === 'needs_closer_review'
    ? 'Needs closer review'
    : 'Preview complete';

  const reportIsPaid = effectiveReport?.report_level === 'advanced';
  const reportNeedsGeneration = accessLevel !== 'free' && !reportIsPaid;
  const sectionFindings = useMemo(
    () => flattenSectionFindings(effectiveReport?.sections || []),
    [effectiveReport]
  );
  const grouped = useMemo(() => summarizeFindings(sectionFindings), [sectionFindings]);
  const recommendationItems = (effectiveReport?.recommendations || []).map(mapRecommendationText);

  const generatePaidReport = async () => {
    if (!biz.websiteId || !user?.id) {
      setReportError('Please sign in again before generating a paid report.');
      return;
    }

    if (!hasActivePaidEntitlement) {
      setReportError('No active paid entitlement was found for this website. Open Billing and activate One-Time or Pro before re-running this scan.');
      return;
    }

    setIsGenerating(true);
    setReportError('');

    try {
      const planLevel = 'advanced';
      const scanType = isProAccess ? 'pro_advanced' : 'advanced_paid';
      const scan = await createTrustScan({
        websiteId: biz.websiteId,
        ownerId: user.id,
        scanType,
        status: 'running',
        rawScanData: {
          domain: biz.url,
          businessName: biz.name,
          reportLevel: planLevel,
        },
      });

      const artifacts = await runPaidReportScan({
        websiteId: biz.websiteId,
        websiteUrl: `https://${biz.url}`,
        domain: biz.url,
        businessName: biz.name,
        businessEmail: biz.email,
        category: biz.category,
        serviceType: biz.serviceType,
        country: biz.country,
        stateRegion: biz.state,
        city: biz.city,
        contactUrl: biz.contactUrl || null,
        privacyUrl: biz.privacyUrl || null,
        termsUrl: biz.termsUrl || null,
        reviewUrl: biz.reviewUrl || null,
        ownershipVerified: biz.ownershipVerified,
      });

      const completedScan = await updateTrustScan(scan.id, {
        status: 'completed',
        overall_status: artifacts.overallStatus,
        score: artifacts.score ?? null,
        findings: artifacts.findings,
        raw_scan_data: artifacts.rawScanData || {},
        completed_at: new Date().toISOString(),
      });

      const report = await createSiteReport({
        websiteId: biz.websiteId,
        ownerId: user.id,
        reportLevel: artifacts.report.reportLevel,
        title: artifacts.report.title,
        summary: artifacts.report.summary,
        score: artifacts.report.score ?? artifacts.score ?? null,
        status: artifacts.report.status || 'complete',
        sections: artifacts.report.sections || [],
        recommendations: artifacts.report.recommendations || [],
        aiSummary: artifacts.report.aiSummary || null,
      });

      const nextVerificationStatus = artifacts.overallStatus === 'approved' ? 'approved' : 'not_approved';
      const nextBadgeStatus = artifacts.overallStatus === 'approved' ? 'active' : 'unavailable';
      const nextPublicPageStatus = artifacts.overallStatus === 'approved' ? 'active' : 'inactive';
      const nextDashboardStatus = nextVerificationStatus === 'approved'
        ? 'approved'
        : nextVerificationStatus === 'not_approved'
        ? 'not_approved'
        : isProAccess
        ? 'pro'
        : 'onetime';
      const now = new Date();
      const nextRecheckAt = isProAccess
        ? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString()
        : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString();

      await updateWebsiteById(biz.websiteId, {
        verification_status: nextVerificationStatus,
        badge_status: nextBadgeStatus,
        public_page_status: nextPublicPageStatus,
        last_checked_at: now.toISOString(),
        next_recheck_at: nextRecheckAt,
        plan_coverage: isProAccess ? 'pro' : 'one_time',
      }, { operation: 'verification_outcome' });

      let badgeRecord = biz.latestBadge || null;

      if (nextVerificationStatus === 'approved') {
        badgeRecord = await ensureBadgeForWebsite({
          websiteId: biz.websiteId,
          ownerId: user.id,
          normalizedDomain: biz.url,
          publicSlugBase: biz.url,
          status: 'active',
          issuedAt: now.toISOString(),
          lastCheckedAt: now.toISOString(),
        });
      } else if (biz.latestBadge?.id) {
        badgeRecord = await updateBadgeById(biz.latestBadge.id, {
          status: 'inactive',
          last_checked_at: now.toISOString(),
        }, { websiteId: biz.websiteId });
      }

      const updatedBiz = {
        ...biz,
        latestReport: report,
        latestScan: completedScan,
        latestBadge: badgeRecord,
        verificationStatus: nextVerificationStatus,
        badgeStatus: nextBadgeStatus,
        publicPageStatus: nextPublicPageStatus,
        lastCheckedAt: now.toISOString(),
        nextRecheckAt,
        planCoverage: isProAccess ? 'pro' : 'one_time',
        dashboardStatus: nextDashboardStatus,
      };

      sessionStorage.setItem('crozora_biz', JSON.stringify(updatedBiz));
      setStatus(nextDashboardStatus);
      window.dispatchEvent(new Event('crozora-biz-refresh'));
      setLocalReport(report);
      setLocalScan(completedScan);
      setLocalStatus(nextVerificationStatus);
    } catch (error) {
      setReportError(error.message || 'We could not generate the paid report yet.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (accessLevel === 'free') {
    return (
      <div className="max-w-xl space-y-5">
        <h1 className="text-3xl font-bold font-space text-white mb-6">Site Report</h1>
        <div className="glass-card rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)' }}>
            <Lock size={24} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white font-space mb-3">Site Report Locked</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'rgba(148,163,184,0.7)' }}>
            Your free preview is complete, but detailed findings are not included on the free plan. Choose one-time verification for this website or start Crozora Pro.
          </p>
          <div className="rounded-xl p-4 text-left mb-6" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Stored preview summary</p>
            <p className="text-sm text-white font-medium mb-2">{freeResult}</p>
            <p className="text-sm text-slate-300">{freeSummary}</p>
            {effectiveScan?.findings?.length ? <p className="text-xs text-slate-500 mt-3">Signals detected: {effectiveScan.findings.length}</p> : null}
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              Unlock Advanced Report - $30
            </button>
            <button onClick={() => setSection('billing')} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(148,163,184,0.7)' }}>
              Start Crozora Pro - $20/month
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold font-space text-white">Advanced Site Report</h1>
          <div
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs"
            style={{
              background: isProAccess ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)',
              border: isProAccess ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(59,130,246,0.2)',
              color: isProAccess ? '#c4b5fd' : '#60a5fa',
            }}
          >
            {isProAccess ? 'Crozora Pro' : `One-Time Verification - ${domain} only`}
          </div>
        </div>
        <button
          onClick={generatePaidReport}
          disabled={isGenerating || !hasActivePaidEntitlement}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            opacity: isGenerating || !hasActivePaidEntitlement ? 0.7 : 1,
          }}
        >
          {isGenerating
            ? 'Running scan...'
            : !hasActivePaidEntitlement
            ? 'Activate Paid Plan to Re-run'
            : reportIsPaid
            ? 'Re-run Advanced Scan'
            : 'Generate Advanced Report'}
        </button>
      </div>

      {!reportIsPaid && (
        <div
          className="p-4 rounded-xl text-sm text-slate-400"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          Use the button above to generate your first advanced report.
        </div>
      )}

      {!hasActivePaidEntitlement ? (
        <div
          className="rounded-xl px-4 py-3 text-sm text-amber-100"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.24)' }}
        >
          This website currently has no active paid entitlement row, so advanced scan re-runs are locked until One-Time or Pro is active.
        </div>
      ) : null}

      {reportNeedsGeneration && (
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Generate your advanced report</h2>
              <p className="text-sm text-slate-400">
                Your entitlement is active, but this website does not have its advanced paid report yet.
              </p>
            </div>
            <button
              onClick={generatePaidReport}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', opacity: isGenerating ? 0.7 : 1 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Advanced Report'}
            </button>
          </div>
        </div>
      )}

      {reportError ? (
        <div className="rounded-xl px-4 py-3 text-sm text-red-100" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
          {reportError}
        </div>
      ) : null}

      {effectiveStatus && isOneTimeAccess && !isProAccess && (
        <div
          className="p-4 rounded-xl flex items-center gap-3"
          style={{
            background: effectiveStatus === 'approved'
              ? 'rgba(16,185,129,0.07)'
              : effectiveStatus === 'not_approved'
              ? 'rgba(239,68,68,0.07)'
              : 'rgba(245,158,11,0.07)',
            border: effectiveStatus === 'approved'
              ? '1px solid rgba(16,185,129,0.2)'
              : effectiveStatus === 'not_approved'
              ? '1px solid rgba(239,68,68,0.2)'
              : '1px solid rgba(245,158,11,0.2)',
          }}
        >
          {effectiveStatus === 'approved'
            ? <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            : effectiveStatus === 'not_approved'
            ? <XCircle size={18} className="text-red-400 flex-shrink-0" />
            : <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />}
          <div>
            <p className="text-white font-semibold text-sm">Verification Decision: {effectiveStatus === 'approved' ? 'Approved' : effectiveStatus === 'not_approved' ? 'Not Approved' : 'Pending Review'}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {effectiveStatus === 'approved'
                ? 'This website passed the current one-time verification checks and now has its advanced one-site report.'
                : effectiveStatus === 'not_approved'
                ? 'This website needs improvements before it can qualify for a badge.'
                : 'This website is waiting for a decision.'}
            </p>
          </div>
        </div>
      )}

      {reportIsPaid && (
        <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Trust Score Breakdown</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-space" style={{ color: (effectiveReport?.score ?? effectiveScan?.score ?? 0) >= 75 ? '#34d399' : '#fbbf24' }}>
                {effectiveReport?.score ?? effectiveScan?.score ?? 0}
              </span>
              <span className="text-slate-500 text-sm">/ 100</span>
            </div>
          </div>
          <div className="w-full h-2.5 rounded-full mb-4" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <div className="h-2.5 rounded-full" style={{ width: `${Math.max(0, Math.min(100, effectiveReport?.score ?? effectiveScan?.score ?? 0))}%`, background: 'linear-gradient(90deg, #3b82f6, #34d399)' }} />
          </div>
        </div>
      )}

      {reportIsPaid && (
        <>
          {grouped.passed.length ? <SectionBlock title="Passed Signals" items={grouped.passed} color="#34d399" icon={CheckCircle} /> : null}
          {grouped.attention.length ? <SectionBlock title="Needs Attention" items={grouped.attention} color="#fbbf24" icon={AlertTriangle} /> : null}
          {grouped.failed.length ? <SectionBlock title="Failed Checks" items={grouped.failed} color="#f87171" icon={XCircle} /> : null}

          {recommendationItems.length ? (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp size={13} className="text-blue-400" /> Prioritized Fixes</h3>
              <div className="space-y-2">
                {recommendationItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.07)' }}>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>Fix</span>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><RefreshCw size={13} className="text-violet-400" /> {isProAccess ? 'Monitoring & Recheck History' : 'One-Time Recheck Guidance'}</h3>
        {isProAccess ? (
          <div className="space-y-2">
            {[
              ['Last recheck', formatDate(biz.lastCheckedAt, 'Not checked yet')],
              ['Next scheduled recheck', formatDate(biz.nextRecheckAt, 'Not scheduled')],
              ['Monitoring status', 'Active while Pro remains active'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-2">
            {[
              'Fix the items highlighted in the report sections above.',
              'Run another paid review when the website changes are live.',
              'A badge is only available after the site passes the current verification checks.',
            ].map((step, index) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-blue-400 mt-0.5 w-4 flex-shrink-0">{index + 1}.</span>
                <span className="text-sm text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
