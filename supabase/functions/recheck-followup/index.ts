import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { generateAiFollowupResponse } from "../_shared/ai-report.ts";
import { resolveWebsiteAccess } from "../_shared/entitlements.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type PlanLevel = "advanced";

type RecheckInput = {
  websiteId: string;
  websiteUrl: string;
  domain: string;
  businessName?: string;
  businessEmail?: string;
  category?: string;
  serviceType?: string;
  country?: string;
  stateRegion?: string;
  city?: string;
  contactUrl?: string | null;
  privacyUrl?: string | null;
  termsUrl?: string | null;
  reviewUrl?: string | null;
  ownershipVerified?: boolean;
  planLevel: PlanLevel;
  userMessage: string;
  previousStatus?: string | null;
  previousFindings?: Array<Record<string, string>>;
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers || {}),
    },
  });
}

function normalizeFindingLabel(finding: Record<string, string>) {
  return String(finding.label || finding.issue || finding.detail || "").trim().toLowerCase();
}

function compareFindings(previousFindings: Array<Record<string, string>>, nextFindings: Array<Record<string, string>>) {
  const previousLabels = new Set(previousFindings.map(normalizeFindingLabel).filter(Boolean));
  const nextLabels = new Set(nextFindings.map(normalizeFindingLabel).filter(Boolean));

  const improved = previousFindings
    .filter((finding) => {
      const label = normalizeFindingLabel(finding);
      return label && !nextLabels.has(label) && finding.type !== "passed";
    })
    .map((finding) => finding.label || finding.issue || finding.detail)
    .filter(Boolean);

  const stillMissing = nextFindings
    .filter((finding) => finding.type !== "passed")
    .map((finding) => finding.label || finding.issue || finding.detail)
    .filter(Boolean);

  const newConcerns = nextFindings
    .filter((finding) => {
      const label = normalizeFindingLabel(finding);
      return label && !previousLabels.has(label) && finding.type !== "passed";
    })
    .map((finding) => finding.label || finding.issue || finding.detail)
    .filter(Boolean);

  return {
    improved: Array.from(new Set(improved)),
    stillMissing: Array.from(new Set(stillMissing)),
    newConcerns: Array.from(new Set(newConcerns)),
  };
}

function buildFallbackFollowup(input: RecheckInput, comparison: ReturnType<typeof compareFindings>, overallStatus: string) {
  const improvedLine = comparison.improved.length
    ? `We found improvements in ${comparison.improved.slice(0, 2).join(" and ")}.`
    : "We did not detect a clear resolved issue from the previous report yet.";
  const missingLine = comparison.stillMissing.length
    ? `Still missing or needing attention: ${comparison.stillMissing.slice(0, 2).join(" and ")}.`
    : "The major previously flagged items no longer appear in the current scan.";
  const nextAction = overallStatus === "approved"
    ? "Your verification status improved enough for approval. Keep the visible trust signals in place and monitor future rechecks."
    : "Keep improving the remaining trust signals, then request another recheck after the updates are live.";

  return {
    message: `You told Crozora: "${input.userMessage}". ${improvedLine} ${missingLine}`,
    nextAction,
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const input = await request.json() as RecheckInput;
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service configuration is missing." }, { status: 500 });
    }

    const access = await resolveWebsiteAccess(request, { websiteId: input.websiteId }, "recheck");
    const authHeader = request.headers.get("Authorization");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!authHeader || !anonKey) {
      return json({ error: "Authentication is required for rechecks." }, { status: 401 });
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/free-preview-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: authHeader,
      },
      body: JSON.stringify({
        websiteId: input.websiteId,
        websiteUrl: access.website.website_url,
        domain: access.website.normalized_domain,
        businessName: access.website.businesses?.business_name || input.businessName,
        businessEmail: access.website.businesses?.business_email || input.businessEmail,
        category: access.website.businesses?.category || input.category,
        serviceType: access.website.businesses?.service_type || input.serviceType,
        country: access.website.businesses?.country || input.country,
        stateRegion: access.website.businesses?.state_region || input.stateRegion,
        city: access.website.businesses?.city || input.city,
        contactUrl: access.website.contact_page_url || input.contactUrl || null,
        privacyUrl: access.website.privacy_policy_url || input.privacyUrl || null,
        termsUrl: access.website.terms_policy_url || input.termsUrl || null,
        reviewUrl: access.website.review_profile_url || input.reviewUrl || null,
        ownershipVerified: access.website.ownership_status === 'verified',
        planLevel: access.planLevel,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      return json({ error: payload?.error || "Recheck scan failed." }, { status: response.status });
    }

    const comparison = compareFindings(input.previousFindings || [], payload.findings || []);
    const aiFollowup = await generateAiFollowupResponse({
      domain: access.website.normalized_domain,
      planLevel: access.planLevel,
      userMessage: input.userMessage,
      previousStatus: input.previousStatus || null,
      newStatus: payload.overallStatus,
      improved: comparison.improved,
      stillMissing: comparison.stillMissing,
    }).catch(() => null);

    const followup = aiFollowup || buildFallbackFollowup(input, comparison, payload.overallStatus);
    const verificationChanged = Boolean(input.previousStatus && input.previousStatus !== payload.overallStatus);

    return json({
      ...payload,
      followup: {
        message: followup.message,
        improved: comparison.improved,
        stillMissing: comparison.stillMissing,
        newConcerns: comparison.newConcerns,
        nextAction: followup.nextAction,
        verificationChanged,
      },
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected recheck failure." },
      { status: 500 },
    );
  }
});
