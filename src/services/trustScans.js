import { supabase } from '@/lib/supabase';

async function extractFunctionErrorMessage(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (error.message && error.message !== 'Edge Function returned a non-2xx status code') {
    return error.message;
  }

  const response = error.context;
  if (response && typeof response.clone === 'function') {
    try {
      const payload = await response.clone().json();
      if (payload?.error) return String(payload.error);
      if (payload?.message) return String(payload.message);
    } catch {
      // ignore JSON parsing failure and try text fallback
    }

    try {
      const text = await response.clone().text();
      if (text) return text;
    } catch {
      // ignore text parsing failure
    }
  }

  return fallback;
}

function hasValue(value) {
  return Boolean(String(value || '').trim());
}

function classifyPreview(input) {
  const positives = [
    hasValue(input.contactUrl),
    hasValue(input.privacyUrl),
    hasValue(input.termsUrl),
    hasValue(input.reviewUrl),
    hasValue(input.email),
    hasValue(input.name),
    hasValue(input.category),
  ].filter(Boolean).length;

  if (positives >= 5) {
    return 'looks_promising';
  }

  if (positives >= 3) {
    return 'needs_improvement';
  }

  return 'needs_closer_review';
}

function buildFindings(input, overallStatus) {
  const findings = [];

  if (hasValue(input.privacyUrl)) {
    findings.push({
      type: 'passed',
      label: 'Privacy policy provided',
      detail: input.privacyUrl,
    });
  } else {
    findings.push({
      type: 'attention',
      label: 'Privacy policy missing',
      detail: 'Add a visible privacy policy page to strengthen trust.',
    });
  }

  if (hasValue(input.contactUrl) || hasValue(input.email)) {
    findings.push({
      type: 'passed',
      label: 'Contact signal found',
      detail: input.contactUrl || input.email,
    });
  } else {
    findings.push({
      type: 'attention',
      label: 'Contact signal missing',
      detail: 'Add a contact page or public business email.',
    });
  }

  if (hasValue(input.termsUrl)) {
    findings.push({
      type: 'passed',
      label: 'Policy or terms page found',
      detail: input.termsUrl,
    });
  } else {
    findings.push({
      type: 'attention',
      label: 'Terms or policy page missing',
      detail: 'Add terms, refund, or service policy details.',
    });
  }

  if (overallStatus === 'needs_closer_review') {
    findings.push({
      type: 'risk',
      label: 'Visible trust signals are limited',
      detail: 'Crozora needs more public trust signals before this site can move confidently toward verification.',
    });
  }

  return findings;
}

export function buildFreePreviewArtifacts(input) {
  const overallStatus = classifyPreview(input);
  const findings = buildFindings(input, overallStatus);

  const titleMap = {
    looks_promising: 'Your website shows early trust signals',
    needs_improvement: 'Your website needs a few stronger trust signals',
    needs_closer_review: 'Your website needs closer review',
  };

  const summaryMap = {
    looks_promising:
      'Crozora found promising public trust signals on this website. A paid verification can unlock detailed findings and next steps.',
    needs_improvement:
      'Crozora found some trust signals, but a few important public signals are still missing or unclear.',
    needs_closer_review:
      'Crozora found limited public trust signals on this website. More visible business information may be needed before deeper verification.',
  };

  return {
    overallStatus,
    findings,
    report: {
      reportLevel: 'free',
      title: titleMap[overallStatus],
      summary: summaryMap[overallStatus],
      status: 'complete',
      sections: [
        {
          id: 'summary',
          title: 'Trust Summary',
          visibility: 'private',
          content: summaryMap[overallStatus],
          severity: overallStatus === 'looks_promising' ? 'info' : overallStatus === 'needs_improvement' ? 'warning' : 'alert',
        },
      ],
      recommendations: [],
      aiSummary: null,
    },
  };
}

async function invokeWebsiteScan(input) {
  const payload = {
    websiteId: input.websiteId,
    websiteUrl: input.websiteUrl,
    domain: input.domain,
    businessName: input.businessName,
    businessEmail: input.businessEmail,
    category: input.category,
    serviceType: input.serviceType,
    country: input.country,
    stateRegion: input.stateRegion,
    city: input.city,
    contactUrl: input.contactUrl || null,
    privacyUrl: input.privacyUrl || null,
    termsUrl: input.termsUrl || null,
    reviewUrl: input.reviewUrl || null,
    ownershipVerified: Boolean(input.ownershipVerified),
    planLevel: input.planLevel || 'free',
  };

  return supabase.functions.invoke('free-preview-scan', {
    body: payload,
  });
}

export async function runFreePreviewScan(input) {
  const { data, error } = await invokeWebsiteScan({
    ...input,
    planLevel: 'free',
  });

  if (error) {
    const message = await extractFunctionErrorMessage(
      error,
      'Could not run the server-side free preview scan.'
    );
    throw new Error(message);
  }

  return data;
}

export async function runPaidReportScan(input) {
  const { data, error } = await invokeWebsiteScan({
    ...input,
    planLevel: 'advanced',
  });

  if (error) {
    const message = await extractFunctionErrorMessage(
      error,
      'Could not run the server-side paid scan.'
    );
    throw new Error(message);
  }

  return data;
}

export async function runRecheckFollowup(input) {
  const { data, error } = await supabase.functions.invoke('recheck-followup', {
    body: input,
  });

  if (error) {
    const message = await extractFunctionErrorMessage(
      error,
      'Could not run the server-side recheck follow-up.'
    );
    throw new Error(message);
  }

  return data;
}

export async function createTrustScan(input) {
  const { data, error } = await supabase
    .from('trust_scans')
    .insert({
      website_id: input.websiteId,
      owner_id: input.ownerId,
      scan_type: input.scanType,
      status: input.status || 'queued',
      overall_status: input.overallStatus || null,
      raw_scan_data: input.rawScanData || {},
      findings: input.findings || [],
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTrustScan(scanId, updates) {
  const { data, error } = await supabase
    .from('trust_scans')
    .update(updates)
    .eq('id', scanId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getLatestScanForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('trust_scans')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
