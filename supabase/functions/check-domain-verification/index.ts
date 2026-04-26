import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type DomainVerificationRow = {
  id: string;
  website_id: string;
  owner_id: string;
  dns_name: string;
  expected_value: string;
  status: string;
  attempts: number | null;
  last_checked_at: string | null;
  verified_at: string | null;
};

type ResolverResult = {
  values: string[];
  payload: Record<string, unknown>;
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

function normalizeTxtValue(value: string) {
  return String(value || "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/\s+/g, " ");
}

function extractTxtValues(payload: Record<string, unknown>) {
  const answers = Array.isArray(payload?.Answer) ? payload.Answer : [];

  return answers
    .filter((answer) => {
      return typeof answer === "object" && answer !== null && Number((answer as Record<string, unknown>).type) === 16;
    })
    .map((answer) => normalizeTxtValue(String((answer as Record<string, unknown>).data || "")))
    .filter(Boolean);
}

async function queryDnsResolver(url: URL) {
  const response = await fetch(url.toString(), {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`DNS lookup failed with status ${response.status}`);
  }

  return await response.json() as Record<string, unknown>;
}

async function lookupDnsTxtRecord(dnsName: string): Promise<ResolverResult> {
  const lookups = [
    () => {
      const url = new URL("https://dns.google/resolve");
      url.searchParams.set("name", dnsName);
      url.searchParams.set("type", "TXT");
      return queryDnsResolver(url);
    },
    () => {
      const url = new URL("https://cloudflare-dns.com/dns-query");
      url.searchParams.set("name", dnsName);
      url.searchParams.set("type", "TXT");
      return queryDnsResolver(url);
    },
  ];

  const errors: Error[] = [];

  for (const resolve of lookups) {
    try {
      const payload = await resolve();
      return {
        values: extractTxtValues(payload),
        payload,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error("DNS resolver failed."));
    }
  }

  throw errors[0] || new Error("DNS lookup failed.");
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
    const verificationId = String(body.verificationId || "").trim();
    const websiteId = String(body.websiteId || "").trim();

    if (!verificationId && !websiteId) {
      return json({ error: "A verification id or website id is required." }, { status: 400 });
    }

    let query = admin
      .from("domain_verifications")
      .select("id, website_id, owner_id, dns_name, expected_value, status, attempts, last_checked_at, verified_at, created_at")
      .eq("owner_id", authData.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (verificationId) {
      query = query.eq("id", verificationId);
    }

    if (websiteId) {
      query = query.eq("website_id", websiteId);
    }

    const { data: verificationRecord, error: verificationError } = await query.maybeSingle();

    if (verificationError) {
      return json({ error: verificationError.message }, { status: 500 });
    }

    if (!verificationRecord) {
      return json({ error: "Domain verification record was not found." }, { status: 404 });
    }

    const verification = verificationRecord as DomainVerificationRow;
    const lookup = await lookupDnsTxtRecord(verification.dns_name);
    const expectedValue = normalizeTxtValue(verification.expected_value);
    const matched = lookup.values.some((value) => normalizeTxtValue(value) === expectedValue);
    const nowIso = new Date().toISOString();

    const { data: updatedVerification, error: updateVerificationError } = await admin
      .from("domain_verifications")
      .update({
        status: matched ? "verified" : "pending",
        verified_at: matched ? nowIso : null,
        last_checked_at: nowIso,
        attempts: (verification.attempts ?? 0) + 1,
      })
      .eq("id", verification.id)
      .eq("owner_id", authData.user.id)
      .select("id, website_id, owner_id, dns_name, expected_value, status, attempts, last_checked_at, verified_at")
      .single();

    if (updateVerificationError) {
      return json({ error: updateVerificationError.message }, { status: 500 });
    }

    const { error: updateWebsiteError } = await admin
      .from("websites")
      .update({
        ownership_status: matched ? "verified" : "pending",
      })
      .eq("id", verification.website_id)
      .eq("owner_id", authData.user.id);

    if (updateWebsiteError) {
      return json({ error: updateWebsiteError.message }, { status: 500 });
    }

    return json({
      matched,
      values: lookup.values,
      verification: updatedVerification,
      ownershipStatus: matched ? "verified" : "pending",
      message: matched
        ? "We found the TXT record and confirmed ownership."
        : "The TXT record is not visible yet. DNS propagation can take time.",
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected domain verification failure." },
      { status: 500 },
    );
  }
});
