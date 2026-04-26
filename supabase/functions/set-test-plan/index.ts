import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type Plan = "free" | "one_time" | "pro";

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

function isTestPlanOverrideEnabled() {
  return Deno.env.get("ALLOW_TEST_PLAN_OVERRIDES") === "true";
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!isTestPlanOverrideEnabled()) {
      return json({ error: "Temporary plan override is disabled in this environment." }, { status: 403 });
    }

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
    const plan = String(body.plan || "").trim() as Plan;

    if (!websiteId) {
      return json({ error: "websiteId is required." }, { status: 400 });
    }

    if (!["free", "one_time", "pro"].includes(plan)) {
      return json({ error: "plan must be one of free, one_time, or pro." }, { status: 400 });
    }

    const { data: website, error: websiteError } = await admin
      .from("websites")
      .select("id, owner_id")
      .eq("id", websiteId)
      .eq("owner_id", authData.user.id)
      .maybeSingle();

    if (websiteError) {
      return json({ error: websiteError.message }, { status: 500 });
    }

    if (!website) {
      return json({ error: "Website not found or access denied." }, { status: 404 });
    }

    const now = new Date();
    const nowIso = now.toISOString();

    const { error: deactivateError } = await admin
      .from("billing_entitlements")
      .update({ status: "inactive" })
      .eq("owner_id", authData.user.id)
      .eq("status", "active");

    if (deactivateError) {
      return json({ error: deactivateError.message }, { status: 500 });
    }

    let entitlement = null;

    if (plan === "one_time") {
      const { data, error } = await admin
        .from("billing_entitlements")
        .insert({
          owner_id: authData.user.id,
          website_id: websiteId,
          entitlement_type: "one_time_site",
          status: "active",
          stripe_payment_id: "test_one_time_payment",
          starts_at: nowIso,
        })
        .select("*")
        .single();

      if (error) {
        return json({ error: error.message }, { status: 500 });
      }

      entitlement = data;
    }

    if (plan === "pro") {
      const endsAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString();
      const { data, error } = await admin
        .from("billing_entitlements")
        .insert({
          owner_id: authData.user.id,
          website_id: null,
          entitlement_type: "pro",
          status: "active",
          stripe_subscription_id: "test_pro_subscription",
          starts_at: nowIso,
          ends_at: endsAt,
        })
        .select("*")
        .single();

      if (error) {
        return json({ error: error.message }, { status: 500 });
      }

      entitlement = data;
    }

    const websiteUpdate: Record<string, string | null> = {
      plan_coverage: plan === "free" ? "free" : plan,
    };

    if (plan === "free") {
      websiteUpdate.verification_status = "not_started";
      websiteUpdate.badge_status = "unavailable";
      websiteUpdate.public_page_status = "inactive";
      websiteUpdate.next_recheck_at = null;
    }

    const { data: updatedWebsite, error: updateWebsiteError } = await admin
      .from("websites")
      .update(websiteUpdate)
      .eq("id", websiteId)
      .eq("owner_id", authData.user.id)
      .select("*")
      .single();

    if (updateWebsiteError) {
      return json({ error: updateWebsiteError.message }, { status: 500 });
    }

    return json({
      ok: true,
      plan,
      website: updatedWebsite,
      entitlement,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected test plan error." },
      { status: 500 },
    );
  }
});
