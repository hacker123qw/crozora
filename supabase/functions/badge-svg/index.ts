import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

const STATUS_STYLES: Record<string, { label: string; accent: string; border: string; glow: string }> = {
  active: {
    label: "Active",
    accent: "#34d399",
    border: "#3b82f6",
    glow: "#0ea5e9",
  },
  expired: {
    label: "Expired",
    accent: "#f59e0b",
    border: "#f59e0b",
    glow: "#fbbf24",
  },
  suspended: {
    label: "Suspended",
    accent: "#f87171",
    border: "#ef4444",
    glow: "#f87171",
  },
  not_found: {
    label: "Unavailable",
    accent: "#94a3b8",
    border: "#475569",
    glow: "#64748b",
  },
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function getVerificationPayload(slug: string, req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !anonKey) {
    return { status: "not_found", domain: "crozora.com" };
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/public-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Origin: req.headers.get("Origin") || "*",
    },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    return { status: "not_found", domain: "crozora.com" };
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const slug = new URL(req.url).searchParams.get("slug")?.trim().toLowerCase() || "";
  const payload = slug ? await getVerificationPayload(slug, req) : { status: "not_found", domain: "crozora.com" };
  const style = STATUS_STYLES[payload.status] || STATUS_STYLES.not_found;
  const domain = escapeXml(payload.domain || slug || "crozora.com");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="260" height="72" viewBox="0 0 260 72" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Crozora badge</title>
  <desc id="desc">Crozora verification badge for ${domain}</desc>
  <defs>
    <linearGradient id="card" x1="18" y1="12" x2="242" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#13233F" />
      <stop offset="1" stop-color="#0B1730" />
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="258" height="70" rx="18" fill="url(#card)" stroke="${style.border}" stroke-opacity="0.45"/>
  <circle cx="40" cy="36" r="17" fill="${style.glow}" fill-opacity="0.15"/>
  <path d="M40 21L48.5 24.4V33.2C48.5 40.7 43.4 45.8 40 47.5C36.6 45.8 31.5 40.7 31.5 33.2V24.4L40 21Z" fill="#38BDF8"/>
  <path d="M36.8 34.7L39.2 37.1L43.7 31.9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="64" y="29" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="14" font-weight="700">Crozora Verified</text>
  <text x="64" y="47" fill="#94A3B8" font-family="Arial, sans-serif" font-size="11">${domain}</text>
  <rect x="186" y="23" width="56" height="24" rx="12" fill="${style.accent}" fill-opacity="0.14" stroke="${style.accent}" stroke-opacity="0.35"/>
  <text x="214" y="39" text-anchor="middle" fill="${style.accent}" font-family="Arial, sans-serif" font-size="11" font-weight="700">${style.label}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      ...corsHeaders,
    },
  });
});
