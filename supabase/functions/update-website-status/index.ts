import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type Operation = "metadata" | "verification_outcome" | "badge_activation";

type WebsiteRow = {
  id: string;
  owner_id: string;
  verification_status: string;
  badge_status: string;
  public_page_status: string;
  plan_coverage: string;
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

function getBearerToken(request: Request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

function pickAllowedUpdates(updates: Record<string, unknown>, allowedFields: string[]) {
  const unknownKeys = Object.keys(updates).filter((key) => !allowedFields.includes(key));
  if (unknownKeys.length) {
    throw new Error(`Unsupported update fields: ${unknownKeys.join(", ")}`);
  }

  const sanitized: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (Object.hasOwn(updates, field)) {
      sanitized[field] = updates[field];
    }
  }

  return sanitized;
}

function normalizeIsoOrNull(value: unknown, fieldName: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid ISO datetime value.`);
  }

  return date.toISOString();
}

function derivePlanCoverageFromEntitlements(
  websiteId: string,
  entitlements: Array<{ entitlement_type: string; website_id: string | null; ends_at: string | null }>,
) {
  const nowIso = new Date().toISOString();
  const active = (entitlements || []).filter((item) => !item.ends_at || item.ends_at >= nowIso);
  const hasPro = active.some((item) => item.entitlement_type === "pro");
  if (hasPro) return "pro";

  const hasOneTime = active.some((item) => item.entitlement_type === "one_time_site" && item.website_id === websiteId);
  if (hasOneTime) return "one_time";

  return "free";
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service configuration is missing." }, { status: 500 });
    }

    const token = getBearerToken(request);
    if (!token) {
      return json({ error: "Authentication is required." }, { status: 401 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) {
      return json({ error: "Your session is no longer valid." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const websiteId = String(body.websiteId || "").trim();
    const updates = typeof body.updates === "object" && body.updates !== null
      ? body.updates as Record<string, unknown>
      : {};
    const operation = String(body.operation || "metadata").trim() as Operation;

    if (!websiteId) {
      return json({ error: "websiteId is required." }, { status: 400 });
    }

    const { data: websiteRecord, error: websiteError } = await admin
      .from("websites")
      .select("id, owner_id, verification_status, badge_status, public_page_status, plan_coverage")
      .eq("id", websiteId)
      .eq("owner_id", authData.user.id)
      .maybeSingle();

    if (websiteError) {
      return json({ error: websiteError.message }, { status: 500 });
    }

    if (!websiteRecord) {
      return json({ error: "Website not found or access denied." }, { status: 404 });
    }

    const website = websiteRecord as WebsiteRow;
    let updatePayload: Record<string, unknown> = {};

    if (operation === "metadata") {
      updatePayload = pickAllowedUpdates(updates, [
        "website_builder",
        "contact_page_url",
        "privacy_policy_url",
        "terms_policy_url",
        "review_profile_url",
      ]);
    } else if (operation === "verification_outcome") {
      pickAllowedUpdates(updates, [
        "verification_status",
        "badge_status",
        "public_page_status",
        "last_checked_at",
        "next_recheck_at",
        "plan_coverage",
      ]);

      const { data: entitlements, error: entitlementError } = await admin
        .from("billing_entitlements")
        .select("entitlement_type, website_id, ends_at")
        .eq("owner_id", authData.user.id)
        .eq("status", "active");

      if (entitlementError) {
        return json({ error: entitlementError.message }, { status: 500 });
      }

      const derivedPlanCoverage = derivePlanCoverageFromEntitlements(website.id, entitlements || []);
      const { data: latestScan, error: latestScanError } = await admin
        .from("trust_scans")
        .select("overall_status")
        .eq("website_id", website.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestScanError) {
        return json({ error: latestScanError.message }, { status: 500 });
      }

      if (!latestScan?.overall_status) {
        return json({ error: "A completed scan is required before updating verification status." }, { status: 400 });
      }

      const derivedVerificationStatus = latestScan.overall_status === "approved" ? "approved" : "not_approved";
      const derivedBadgeStatus = derivedVerificationStatus === "approved" ? "active" : "unavailable";
      const derivedPublicPageStatus = derivedVerificationStatus === "approved" ? "active" : "inactive";
      const desiredLastChecked = normalizeIsoOrNull(updates.last_checked_at, "last_checked_at") || new Date().toISOString();
      const desiredNextRecheck = normalizeIsoOrNull(updates.next_recheck_at, "next_recheck_at");

      if (updates.verification_status && updates.verification_status !== derivedVerificationStatus) {
        return json({ error: "verification_status does not match the latest completed scan outcome." }, { status: 403 });
      }

      if (updates.badge_status && updates.badge_status !== derivedBadgeStatus) {
        return json({ error: "badge_status does not match the derived verification outcome." }, { status: 403 });
      }

      if (updates.public_page_status && updates.public_page_status !== derivedPublicPageStatus) {
        return json({ error: "public_page_status does not match the derived verification outcome." }, { status: 403 });
      }

      if (updates.plan_coverage && updates.plan_coverage !== derivedPlanCoverage) {
        return json({ error: "plan_coverage does not match the active entitlement state." }, { status: 403 });
      }

      updatePayload = {
        verification_status: derivedVerificationStatus,
        badge_status: derivedBadgeStatus,
        public_page_status: derivedPublicPageStatus,
        plan_coverage: derivedPlanCoverage,
        last_checked_at: desiredLastChecked,
        next_recheck_at: desiredNextRecheck,
      };
    } else if (operation === "badge_activation") {
      pickAllowedUpdates(updates, ["badge_status", "public_page_status", "last_checked_at"]);

      if (website.verification_status !== "approved") {
        return json({ error: "Website must be approved before badge activation." }, { status: 403 });
      }

      const { data: activeBadge, error: badgeError } = await admin
        .from("badges")
        .select("id, status")
        .eq("website_id", website.id)
        .eq("owner_id", authData.user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (badgeError) {
        return json({ error: badgeError.message }, { status: 500 });
      }

      if (!activeBadge) {
        return json({ error: "An active badge record is required before enabling public badge status." }, { status: 400 });
      }

      if (updates.badge_status && updates.badge_status !== "active") {
        return json({ error: "badge_status must remain active for badge activation." }, { status: 403 });
      }

      if (updates.public_page_status && updates.public_page_status !== "active") {
        return json({ error: "public_page_status must remain active for badge activation." }, { status: 403 });
      }

      updatePayload = {
        badge_status: "active",
        public_page_status: "active",
        last_checked_at: normalizeIsoOrNull(updates.last_checked_at, "last_checked_at") || new Date().toISOString(),
      };
    } else {
      return json({ error: "Unsupported update operation." }, { status: 400 });
    }

    if (!Object.keys(updatePayload).length) {
      return json({ error: "No valid updates were provided." }, { status: 400 });
    }

    const { data: updatedWebsite, error: updateError } = await admin
      .from("websites")
      .update(updatePayload)
      .eq("id", website.id)
      .eq("owner_id", authData.user.id)
      .select("*")
      .single();

    if (updateError) {
      return json({ error: updateError.message }, { status: 500 });
    }

    return json({
      ok: true,
      website: updatedWebsite,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected website update failure." },
      { status: 500 },
    );
  }
});
