import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type BadgeRow = {
  website_id?: string;
  status: string;
  public_slug: string;
  last_checked_at: string | null;
  issued_at: string | null;
  expires_at: string | null;
  websites: null | {
    normalized_domain: string;
    website_url: string;
    ownership_status: string;
    verification_status: string;
    badge_status: string;
    public_page_status: string;
    preview_status: string;
    contact_page_url: string | null;
    privacy_policy_url: string | null;
    terms_policy_url: string | null;
    review_profile_url: string | null;
    last_checked_at: string | null;
    next_recheck_at: string | null;
    businesses: null | {
      business_name: string | null;
      business_email: string | null;
    };
  };
};

type ScanRow = {
  overall_status: string | null;
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

function normalizeStatus(badge: BadgeRow | null) {
  if (!badge?.websites) return "not_found";
  if (badge.websites.public_page_status !== "active") return "not_found";
  if (badge.status === "active") return "active";
  if (badge.status === "expired") return "expired";
  if (badge.status === "suspended" || badge.status === "revoked") return "suspended";
  return "not_found";
}

function buildStatusMessage(status: string) {
  if (status === "expired") {
    return "This Crozora verification has expired and is no longer active.";
  }

  if (status === "suspended") {
    return "This Crozora verification is currently suspended pending review.";
  }

  return "No active Crozora verification record was found for this page.";
}

function buildChecks(badge: BadgeRow, latestScan: ScanRow | null) {
  const website = badge.websites;
  const business = website?.businesses;

  return [
    {
      key: "ownership",
      label: "Website ownership confirmed",
      passed: website?.ownership_status === "verified",
    },
    {
      key: "https",
      label: "HTTPS detected",
      passed: String(website?.website_url || "").startsWith("https://"),
    },
    {
      key: "contact",
      label: "Business contact signals reviewed",
      passed: Boolean(website?.contact_page_url || business?.business_email),
    },
    {
      key: "policies",
      label: "Public business policies found",
      passed: Boolean(website?.privacy_policy_url || website?.terms_policy_url),
    },
    {
      key: "risk",
      label: "No major visible scam-risk signals detected",
      passed: Boolean(latestScan) && latestScan?.overall_status !== "needs_closer_review" && latestScan?.overall_status !== "not_approved",
    },
    {
      key: "authenticity",
      label: "Badge authenticity confirmed",
      passed: true,
    },
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service configuration is missing." }, { status: 500 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let slug = "";

    if (req.method === "GET") {
      slug = new URL(req.url).searchParams.get("slug") || "";
    } else {
      const body = await req.json().catch(() => ({}));
      slug = String(body.slug || "");
    }

    slug = slug.trim().toLowerCase();

    if (!slug) {
      return json({ error: "Missing verification slug." }, { status: 400 });
    }

    const { data: badgeRecord, error: badgeError } = await admin
      .from("badges")
      .select(`
        website_id,
        status,
        public_slug,
        last_checked_at,
        issued_at,
        expires_at,
        websites (
          normalized_domain,
          website_url,
          ownership_status,
          verification_status,
          badge_status,
          public_page_status,
          preview_status,
          contact_page_url,
          privacy_policy_url,
          terms_policy_url,
          review_profile_url,
          last_checked_at,
          next_recheck_at,
          businesses (
            business_name,
            business_email
          )
        )
      `)
      .eq("public_slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (badgeError) {
      return json({ error: badgeError.message }, { status: 500 });
    }

    const badge = badgeRecord as BadgeRow | null;

    if (!badge?.websites) {
      return json({
        found: false,
        status: "not_found",
        message: buildStatusMessage("not_found"),
        disclaimer:
          "Crozora verification means a website passed Crozora's checks at the time shown. It does not guarantee every customer experience or remove all risk.",
      });
    }

    const { data: latestScanRecord } = await admin
      .from("trust_scans")
      .select("overall_status")
      .eq("website_id", badge.website_id || "")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const latestScan = latestScanRecord as ScanRow | null;

    const status = normalizeStatus(badge);

    return json({
      found: status !== "not_found",
      status,
      message: status === "active" ? null : buildStatusMessage(status),
      businessName: badge.websites.businesses?.business_name || badge.websites.normalized_domain,
      domain: badge.websites.normalized_domain,
      websiteUrl: badge.websites.website_url,
      publicSlug: badge.public_slug,
      lastCheckedAt: badge.last_checked_at || badge.websites.last_checked_at,
      nextRecheckAt: badge.websites.next_recheck_at,
      checks: buildChecks(badge, latestScan),
      disclaimer:
        "Crozora verification means this website passed Crozora's checks at the time shown. It does not guarantee every customer experience or remove all risk.",
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected public verification error." },
      { status: 500 }
    );
  }
});
