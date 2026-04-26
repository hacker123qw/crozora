import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type BadgeStatus = "active" | "inactive" | "expired" | "suspended" | "revoked";

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

function normalizeIsoOrNull(value: unknown, fieldName: string) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} must be a valid ISO datetime value.`);
  }

  return parsed.toISOString();
}

function slugifySegment(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createBadgeToken() {
  return `czr_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

async function generateUniquePublicSlug(
  admin: ReturnType<typeof createClient>,
  baseSlug: string,
) {
  let attempt = 0;

  while (attempt < 5) {
    const suffix = attempt === 0 ? "" : `-${crypto.randomUUID().slice(0, 6)}`;
    const candidate = `${baseSlug}${suffix}`;
    const { data, error } = await admin
      .from("badges")
      .select("id")
      .eq("public_slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    attempt += 1;
  }

  return `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
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
    const badgeId = String(body.badgeId || "").trim();
    const desiredStatus = String(body.desiredStatus || "active").trim() as BadgeStatus;
    const normalizedDomain = String(body.normalizedDomain || body.publicSlugBase || "").trim();
    const issuedAt = normalizeIsoOrNull(body.issuedAt, "issuedAt");
    const expiresAt = normalizeIsoOrNull(body.expiresAt, "expiresAt");
    const lastCheckedAt = normalizeIsoOrNull(body.lastCheckedAt, "lastCheckedAt") || new Date().toISOString();

    if (!websiteId) {
      return json({ error: "websiteId is required." }, { status: 400 });
    }

    if (!["active", "inactive", "expired", "suspended", "revoked"].includes(desiredStatus)) {
      return json({ error: "Unsupported badge status." }, { status: 400 });
    }

    const { data: website, error: websiteError } = await admin
      .from("websites")
      .select("id, owner_id, verification_status, normalized_domain")
      .eq("id", websiteId)
      .eq("owner_id", authData.user.id)
      .maybeSingle();

    if (websiteError) {
      return json({ error: websiteError.message }, { status: 500 });
    }

    if (!website) {
      return json({ error: "Website not found or access denied." }, { status: 404 });
    }

    if (desiredStatus === "active" && website.verification_status !== "approved") {
      return json({ error: "Badge can only be active for approved websites." }, { status: 403 });
    }

    const { data: existingBadge, error: existingBadgeError } = await admin
      .from("badges")
      .select("*")
      .eq("website_id", websiteId)
      .eq("owner_id", authData.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingBadgeError) {
      return json({ error: existingBadgeError.message }, { status: 500 });
    }

    if (badgeId && existingBadge?.id && existingBadge.id !== badgeId) {
      return json({ error: "badgeId does not match the latest badge for this website." }, { status: 400 });
    }

    if (existingBadge) {
      const updatePayload: Record<string, unknown> = {
        status: desiredStatus,
        last_checked_at: lastCheckedAt,
      };

      if (!existingBadge.issued_at && issuedAt) {
        updatePayload.issued_at = issuedAt;
      }

      if (expiresAt !== undefined) {
        updatePayload.expires_at = expiresAt;
      }

      const { data: updatedBadge, error: updateError } = await admin
        .from("badges")
        .update(updatePayload)
        .eq("id", existingBadge.id)
        .eq("owner_id", authData.user.id)
        .select("*")
        .single();

      if (updateError) {
        return json({ error: updateError.message }, { status: 500 });
      }

      return json({
        ok: true,
        badge: updatedBadge,
      });
    }

    const baseSlug = slugifySegment(normalizedDomain || website.normalized_domain || `site-${crypto.randomUUID().slice(0, 8)}`)
      || `site-${crypto.randomUUID().slice(0, 8)}`;
    const publicSlug = await generateUniquePublicSlug(admin, baseSlug);

    const { data: createdBadge, error: createError } = await admin
      .from("badges")
      .insert({
        website_id: website.id,
        owner_id: authData.user.id,
        badge_token: createBadgeToken(),
        status: desiredStatus,
        public_slug: publicSlug,
        issued_at: issuedAt || lastCheckedAt,
        expires_at: expiresAt === undefined ? null : expiresAt,
        last_checked_at: lastCheckedAt,
      })
      .select("*")
      .single();

    if (createError) {
      return json({ error: createError.message }, { status: 500 });
    }

    return json({
      ok: true,
      badge: createdBadge,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected badge operation failure." },
      { status: 500 },
    );
  }
});
