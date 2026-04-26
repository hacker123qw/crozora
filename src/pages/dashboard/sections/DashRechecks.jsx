import { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquare, RefreshCw, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { createSiteReport } from '@/services/reports';
import { createTrustScan, runRecheckFollowup, updateTrustScan } from '@/services/trustScans';
import { updateWebsiteById } from '@/services/websites';
import { createRecheckRequest, listRecheckRequestsForWebsite, updateRecheckRequest } from '@/services/rechecks';
import { createAiReportMessage, listAiReportMessagesForWebsite } from '@/services/aiReportMessages';
import { ensureBadgeForWebsite, updateBadgeById } from '@/services/badges';

function formatDate(value, fallback = 'Not available') {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function MessageBubble({ role, content, createdAt }) {
  const isUser = role === 'user';
  return (
    <div className={`rounded-2xl p-4 ${isUser ? 'ml-auto max-w-[88%]' : 'mr-auto max-w-[92%]'}`} style={{
      background: isUser ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.04)',
      border: isUser ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(59,130,246,0.1)',
    }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold" style={{ color: isUser ? '#60a5fa' : '#c4b5fd' }}>
          {isUser ? 'You' : 'Crozora AI'}
        </span>
        <span className="text-[11px] text-slate-500">{formatDate(createdAt, 'Just now')}</span>
      </div>
      <p className="text-sm text-slate-200 whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function FollowupSummary({ followup }) {
  if (!followup) return null;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4" style={{ border: '1px solid rgba(59,130,246,0.16)' }}>
      <div className="flex items-center gap-2 text-white font-semibold">
        <Sparkles size={15} className="text-violet-400" />
        Recheck summary
      </div>

      {followup.improved?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">Improved</p>
          <div className="space-y-2">
            {followup.improved.map((item) => (
              <div key={item} className="text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </div>
      ) : null}

      {followup.stillMissing?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-2">Still missing</p>
          <div className="space-y-2">
            {followup.stillMissing.map((item) => (
              <div key={item} className="text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </div>
      ) : null}

      {followup.nextAction ? (
        <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400 mb-2">Next recommended action</p>
          <p className="text-sm text-slate-300">{followup.nextAction}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function DashRechecks({ biz, status, setSection }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [followup, setFollowup] = useState(null);

  const isLocked = status === 'free';
  const isPro = status === 'pro' || biz.activeEntitlement?.entitlement_type === 'pro';
  const planLevel = 'advanced';
  const latestRequest = requests[0] || null;
  const latestMessages = useMemo(() => messages.slice(-6), [messages]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!biz.websiteId || !user?.id || isLocked) return;

      try {
        const [nextMessages, nextRequests] = await Promise.all([
          listAiReportMessagesForWebsite(biz.websiteId),
          listRecheckRequestsForWebsite(biz.websiteId),
        ]);

        if (!active) return;
        setMessages(nextMessages);
        setRequests(nextRequests);
      } catch {
        if (!active) return;
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [biz.websiteId, user?.id, isLocked]);

  const handleSubmit = async () => {
    if (!draft.trim() || !biz.websiteId || !user?.id) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setFollowup(null);

    const now = new Date();
    const nowIso = now.toISOString();

    try {
      const userMessage = await createAiReportMessage({
        websiteId: biz.websiteId,
        ownerId: user.id,
        role: 'user',
        content: draft.trim(),
      });
      setMessages((current) => [...current, userMessage]);

      const request = await createRecheckRequest({
        websiteId: biz.websiteId,
        ownerId: user.id,
        message: draft.trim(),
        status: 'running',
      });
      setRequests((current) => [request, ...current]);

      const scan = await createTrustScan({
        websiteId: biz.websiteId,
        ownerId: user.id,
        scanType: 'recheck',
        status: 'running',
        rawScanData: {
          domain: biz.url,
          businessName: biz.name,
          recheckMessage: draft.trim(),
          reportLevel: planLevel,
        },
      });

      const result = await runRecheckFollowup({
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
        planLevel,
        userMessage: draft.trim(),
        previousStatus: biz.verificationStatus || biz.latestScan?.overall_status || null,
        previousFindings: biz.latestScan?.findings || [],
      });

      const completedScan = await updateTrustScan(scan.id, {
        status: 'completed',
        overall_status: result.overallStatus,
        score: result.score ?? null,
        findings: result.findings || [],
        raw_scan_data: result.rawScanData || {},
        completed_at: nowIso,
      });

      const report = await createSiteReport({
        websiteId: biz.websiteId,
        ownerId: user.id,
        reportLevel: result.report.reportLevel,
        title: result.report.title,
        summary: result.report.summary,
        score: result.report.score ?? result.score ?? null,
        status: result.report.status || 'complete',
        sections: result.report.sections || [],
        recommendations: result.report.recommendations || [],
        aiSummary: result.report.aiSummary || result.followup?.message || null,
      });

      const nextVerificationStatus = result.overallStatus === 'approved' ? 'approved' : 'not_approved';
      const nextBadgeStatus = result.overallStatus === 'approved' ? 'active' : 'unavailable';
      const nextPublicPageStatus = result.overallStatus === 'approved' ? 'active' : 'inactive';
      const nextRecheckAt = isPro
        ? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString()
        : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString();

      await updateWebsiteById(biz.websiteId, {
        verification_status: nextVerificationStatus,
        badge_status: nextBadgeStatus,
        public_page_status: nextPublicPageStatus,
        last_checked_at: nowIso,
        next_recheck_at: nextRecheckAt,
      }, { operation: 'verification_outcome' });

      let badgeRecord = biz.latestBadge || null;
      if (nextVerificationStatus === 'approved') {
        badgeRecord = await ensureBadgeForWebsite({
          websiteId: biz.websiteId,
          ownerId: user.id,
          normalizedDomain: biz.url,
          publicSlugBase: biz.url,
          status: 'active',
          issuedAt: nowIso,
          lastCheckedAt: nowIso,
        });
      } else if (biz.latestBadge?.id) {
        badgeRecord = await updateBadgeById(biz.latestBadge.id, {
          status: 'inactive',
          last_checked_at: nowIso,
        }, { websiteId: biz.websiteId });
      }

      const completedRequest = await updateRecheckRequest(request.id, {
        status: 'complete',
        completed_at: nowIso,
      });

      const assistantMessage = await createAiReportMessage({
        websiteId: biz.websiteId,
        ownerId: user.id,
        role: 'assistant',
        content: result.followup?.message || 'Your recheck is complete. Review the updated report for the newest findings.',
      });

      setRequests((current) => current.map((item) => (item.id === request.id ? completedRequest : item)));
      setMessages((current) => [...current, assistantMessage]);
      setFollowup(result.followup || null);
      setDraft('');

      const updatedBiz = {
        ...biz,
        latestScan: completedScan,
        latestReport: report,
        latestBadge: badgeRecord,
        verificationStatus: nextVerificationStatus,
        badgeStatus: nextBadgeStatus,
        publicPageStatus: nextPublicPageStatus,
        lastCheckedAt: nowIso,
        nextRecheckAt,
        dashboardStatus: nextVerificationStatus === 'approved'
          ? 'approved'
          : nextVerificationStatus === 'not_approved'
          ? 'not_approved'
          : status,
      };

      sessionStorage.setItem('crozora_biz', JSON.stringify(updatedBiz));
      window.dispatchEvent(new Event('crozora-biz-refresh'));
    } catch (nextError) {
      setError(nextError.message || 'We could not run the recheck yet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLocked) {
    return (
      <div className="max-w-xl space-y-5">
        <h1 className="text-3xl font-bold font-space text-white">Rechecks</h1>
        <div className="glass-card rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <RefreshCw size={28} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Rechecks are not included on the free plan</h2>
          <p className="text-sm text-slate-400 mb-6">Upgrade to one-time verification or Crozora Pro to request a follow-up check after you make website changes.</p>
          <button onClick={() => setSection('billing')} className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            View plan options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold font-space text-white">Rechecks & AI Follow-Up</h1>
        <p className="text-sm text-slate-400 mt-2">
          Tell Crozora what you changed on the site. We will run a fresh scan, compare it with the earlier findings, and explain what improved and what still needs work.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-5">
        <div className="glass-card rounded-2xl p-5 space-y-4" style={{ border: '1px solid rgba(59,130,246,0.16)' }}>
          <div className="flex items-center gap-2 text-white font-semibold">
            <MessageSquare size={15} className="text-blue-400" />
            Recheck conversation
          </div>

          {latestMessages.length ? (
            <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
              {latestMessages.map((message) => (
                <MessageBubble key={message.id} role={message.role} content={message.content} createdAt={message.created_at} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No follow-up messages yet. Start by describing what you changed on the website.</p>
          )}

          <div className="space-y-3 pt-2" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">What changed?</label>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={5}
              placeholder="Example: I added a refund policy, updated the contact page, and made the business email visible in the footer."
              className="w-full rounded-2xl px-4 py-3 text-sm text-slate-200 resize-none outline-none"
              style={{ background: 'rgba(3,7,18,0.72)', border: '1px solid rgba(59,130,246,0.12)' }}
            />
            {error ? (
              <div className="rounded-xl px-4 py-3 text-sm text-red-100" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>
                {error}
              </div>
            ) : null}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !draft.trim()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', opacity: isSubmitting || !draft.trim() ? 0.72 : 1 }}
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Running recheck</> : <><Send size={15} /> Request recheck</>}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <RefreshCw size={14} className="text-violet-400" />
              Recheck status
            </h3>
            <div className="space-y-3">
              {[
                ['Last checked', formatDate(biz.lastCheckedAt, 'Not checked yet')],
                ['Next scheduled recheck', formatDate(biz.nextRecheckAt, 'Not scheduled')],
                ['Latest request', latestRequest ? latestRequest.status : 'No request yet'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-medium text-white text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <FollowupSummary followup={followup} />
        </div>
      </div>
    </div>
  );
}
