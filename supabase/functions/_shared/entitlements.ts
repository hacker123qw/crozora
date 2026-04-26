import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

type PlanLevel = "free" | "advanced";
type ScanMode = "free" | "paid" | "recheck";

type AccessContext = {
  userId: string;
  website: {
    id: string;
    owner_id: string;
    normalized_domain: string;
    website_url: string;
    website_builder: string | null;
    contact_page_url: string | null;
    privacy_policy_url: string | null;
    terms_policy_url: string | null;
    review_profile_url: string | null;
    ownership_status: string;
    plan_coverage: string;
    businesses: null | {
      business_name: string | null;
      business_email: string | null;
      category: string | null;
      service_type: string | null;
      country: string | null;
      state_region: string | null;
      city: string | null;
    };
  };
  entitlementType: "free" | "one_time_site" | "pro";
  planLevel: PlanLevel;
};

function getBearerToken(request: Request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

export async function resolveWebsiteAccess(
  request: Request,
  input: { websiteId?: string | null },
  mode: ScanMode,
): Promise<AccessContext> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service configuration is missing.");
  }

  const token = getBearerToken(request);
  if (!token) {
    throw new Error("Authentication is required.");
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) {
    throw new Error("Your session is no longer valid.");
  }

  if (!input.websiteId) {
    throw new Error("A website id is required for this scan.");
  }

  const { data: website, error: websiteError } = await admin
    .from("websites")
    .select(`
      id,
      owner_id,
      normalized_domain,
      website_url,
      website_builder,
      contact_page_url,
      privacy_policy_url,
      terms_policy_url,
      review_profile_url,
      ownership_status,
      plan_coverage,
      businesses (
        business_name,
        business_email,
        category,
        service_type,
        country,
        state_region,
        city
      )
    `)
    .eq("id", input.websiteId)
    .eq("owner_id", authData.user.id)
    .maybeSingle();

  if (websiteError) {
    throw new Error(websiteError.message);
  }

  if (!website) {
    throw new Error("We could not find a website you are allowed to scan.");
  }

  if (mode === "free") {
    return {
      userId: authData.user.id,
      website,
      entitlementType: "free",
      planLevel: "free",
    };
  }

  const nowIso = new Date().toISOString();
  const { data: entitlements, error: entitlementError } = await admin
    .from("billing_entitlements")
    .select("entitlement_type, website_id, status, ends_at")
    .eq("owner_id", authData.user.id)
    .eq("status", "active");

  if (entitlementError) {
    throw new Error(entitlementError.message);
  }

  const activeEntitlements = (entitlements || []).filter((item) => !item.ends_at || item.ends_at >= nowIso);
  const pro = activeEntitlements.find((item) => item.entitlement_type === "pro");
  const oneTime = activeEntitlements.find(
    (item) => item.entitlement_type === "one_time_site" && item.website_id === website.id,
  );

  if (!pro && !oneTime) {
    throw new Error("This action requires an active paid entitlement for the selected website.");
  }

  return {
    userId: authData.user.id,
    website,
    entitlementType: pro ? "pro" : "one_time_site",
    planLevel: "advanced",
  };
}
