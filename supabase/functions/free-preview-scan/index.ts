import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { generateAiReportAugmentation } from "../_shared/ai-report.ts";
import { resolveWebsiteAccess } from "../_shared/entitlements.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
};

type PlanLevel = "free" | "advanced";

type ScanInput = {
  websiteId?: string | null;
  websiteUrl?: string;
  domain?: string;
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
  planLevel?: PlanLevel;
};

type PageSnapshot = {
  url: string;
  finalUrl: string;
  status: number;
  ok: boolean;
  title: string;
  metaDescription: string;
  text: string;
  links: string[];
  emails: string[];
  phones: string[];
  scriptSources: string[];
  likelyClientShell: boolean;
};

type BundleRouteSignals = {
  routePaths: string[];
  hasPrivacySignal: boolean;
  hasTermsSignal: boolean;
  hasAboutSignal: boolean;
  hasContactSignal: boolean;
  hasPricingSignal: boolean;
  hasReviewSignal: boolean;
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

function normalizeDomain(input?: string) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return "";
  return trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .toLowerCase();
}

function normalizeWebsiteUrl(input?: string) {
  const domain = normalizeDomain(input);
  return domain ? `https://${domain}` : "";
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(html: string) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
}

function extractMetaDescription(html: string) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i)
    || html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i);
  return match?.[1]?.trim() || "";
}

function extractEmails(text: string) {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return Array.from(new Set(matches.map((email) => email.toLowerCase())));
}

function extractPhones(text: string) {
  const matches = text.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g) || [];
  return Array.from(new Set(matches));
}

function extractLinks(html: string, baseUrl: string) {
  const links = Array.from(html.matchAll(/<a[^>]+href=(?:"([^"#]+)"|'([^'#]+)'|([^\s>#"']+))/gi))
    .map((match) => match[1] || match[2] || match[3] || "")
    .filter(Boolean)
    .map((href) => {
      try {
        return new URL(href, baseUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((href): href is string => Boolean(href));

  return Array.from(new Set(links));
}

function extractScriptSources(html: string, baseUrl: string) {
  const scripts = Array.from(html.matchAll(/<script[^>]+src=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi))
    .map((match) => match[1] || match[2] || match[3] || "")
    .filter(Boolean)
    .map((src) => {
      try {
        return new URL(src, baseUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((src): src is string => Boolean(src));

  return Array.from(new Set(scripts));
}

function detectLikelyClientShell(html: string, text: string) {
  const compactText = text.trim();
  const looksLikeRootShell = /<div[^>]+id=["']root["'][^>]*>\s*<\/div>/i.test(html)
    || /<div[^>]+id=["']app["'][^>]*>\s*<\/div>/i.test(html);
  const hasModuleBundle = /<script[^>]+type=["']module["'][^>]+src=/i.test(html);
  const hasVeryLittleBodyText = compactText.length < 900;

  return looksLikeRootShell && hasModuleBundle && hasVeryLittleBodyText;
}

async function fetchBundleRouteSignals(snapshot: PageSnapshot): Promise<BundleRouteSignals> {
  const emptySignals: BundleRouteSignals = {
    routePaths: [],
    hasPrivacySignal: false,
    hasTermsSignal: false,
    hasAboutSignal: false,
    hasContactSignal: false,
    hasPricingSignal: false,
    hasReviewSignal: false,
  };

  if (!snapshot.likelyClientShell || !snapshot.scriptSources.length) {
    return emptySignals;
  }

  const candidateBundle = snapshot.scriptSources.find((src) => src.endsWith(".js")) || snapshot.scriptSources[0];
  if (!candidateBundle) {
    return emptySignals;
  }

  try {
    const response = await fetch(candidateBundle, {
      headers: {
        "user-agent": "CrozoraPreviewBot/1.0 (+https://crozora.com)",
        accept: "*/*",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return emptySignals;
    }

    const bundleText = await response.text();
    const routeMatches = Array.from(
      bundleText.matchAll(/\/(?:about|privacy|terms|contact|support|security|refund|cancellation|pricing|plans|quote|reviews?)[a-z0-9/_-]*/gi),
    )
      .map((match) => String(match[0] || "").toLowerCase())
      .filter((path) => path.length > 1 && path.length < 120);

    const uniqueRoutePaths = Array.from(new Set(routeMatches)).slice(0, 20);
    const lower = bundleText.toLowerCase();

    return {
      routePaths: uniqueRoutePaths,
      hasPrivacySignal: uniqueRoutePaths.some((path) => path.includes("privacy")) || lower.includes("privacy policy"),
      hasTermsSignal: uniqueRoutePaths.some((path) => path.includes("terms") || path.includes("refund") || path.includes("cancellation"))
        || lower.includes("terms of service")
        || lower.includes("refund policy"),
      hasAboutSignal: uniqueRoutePaths.some((path) => path.includes("about")) || lower.includes("about us"),
      hasContactSignal: uniqueRoutePaths.some((path) => path.includes("contact") || path.includes("support")) || lower.includes("contact us"),
      hasPricingSignal: uniqueRoutePaths.some((path) => path.includes("pricing") || path.includes("plans") || path.includes("quote"))
        || lower.includes("pricing"),
      hasReviewSignal: uniqueRoutePaths.some((path) => path.includes("review")) || lower.includes("reviews"),
    };
  } catch {
    return emptySignals;
  }
}

function findRouteCandidate(routePaths: string[], homepageUrl: string, keywords: string[]) {
  if (!routePaths.length || !homepageUrl) {
    return null;
  }

  const origin = new URL(homepageUrl).origin;
  const candidate = routePaths.find((path) =>
    keywords.some((keyword) => path.includes(keyword))
  );

  return candidate ? `${origin}${candidate}` : null;
}

async function fetchPage(url: string): Promise<PageSnapshot> {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "CrozoraPreviewBot/1.0 (+https://crozora.com)",
      accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12000),
  });

  const html = await response.text();
  const text = stripHtml(html);
  const finalUrl = response.url || url;

  return {
    url,
    finalUrl,
    status: response.status,
    ok: response.ok,
    title: extractTitle(html),
    metaDescription: extractMetaDescription(html),
    text,
    links: extractLinks(html, finalUrl),
    emails: extractEmails(text),
    phones: extractPhones(text),
    scriptSources: extractScriptSources(html, finalUrl),
    likelyClientShell: detectLikelyClientShell(html, text),
  };
}

function findInternalCandidate(snapshot: PageSnapshot, keywords: string[]) {
  return snapshot.links.find((link) => {
    try {
      const path = new URL(link).pathname.toLowerCase();
      return keywords.some((keyword) => path.includes(keyword));
    } catch {
      return false;
    }
  }) || null;
}

function includesAny(text: string, patterns: string[]) {
  const lower = text.toLowerCase();
  return patterns.some((pattern) => lower.includes(pattern));
}

function buildPreviewStatus(signals: {
  reachable: boolean;
  https: boolean;
  contactSignal: boolean;
  privacySignal: boolean;
  termsSignal: boolean;
  aboutSignal: boolean;
  reviewSignal: boolean;
  parked: boolean;
  broken: boolean;
  urgencyRisk: boolean;
}) {
  let concerns = 0;
  if (!signals.reachable || signals.broken || signals.parked) concerns += 3;
  if (!signals.https) concerns += 2;
  if (!signals.contactSignal) concerns += 2;
  if (!signals.privacySignal) concerns += 2;
  if (!signals.termsSignal) concerns += 1;
  if (!signals.aboutSignal) concerns += 1;
  if (!signals.reviewSignal) concerns += 1;
  if (signals.urgencyRisk) concerns += 1;

  if (concerns <= 2) return "looks_promising";
  if (concerns <= 5) return "needs_improvement";
  return "needs_closer_review";
}

function buildScore(facts: Record<string, unknown>) {
  let score = 100;
  if (!facts.homepageReachable) score -= 25;
  if (!facts.httpsDetected) score -= 15;
  if (!facts.contactSignalFound) score -= 12;
  if (!facts.privacyPolicyFound) score -= 12;
  if (!facts.termsPolicyFound) score -= 8;
  if (!facts.aboutPageFound) score -= 6;
  if (!facts.reviewSignalFound) score -= 5;
  if (!facts.pricingSignalFound) score -= 4;
  if (facts.parkedDomainIndicators) score -= 20;
  if (facts.brokenHomepageResponse) score -= 20;
  if (facts.urgencyLanguageDetected) score -= 6;
  if (facts.fakeBadgeLanguageDetected) score -= 8;
  if (!facts.businessNameVisible) score -= 4;
  if (!facts.homepageTitleFound) score -= 2;
  if (!facts.metaDescriptionFound) score -= 1;
  return Math.max(0, Math.min(100, score));
}

function buildPaidDecision(facts: Record<string, unknown>, score: number) {
  const hardFailure = !facts.homepageReachable || !facts.httpsDetected || !facts.contactSignalFound || !facts.privacyPolicyFound;
  if (!hardFailure && score >= 75) return "approved";
  return "not_approved";
}

function buildFindings(input: ScanInput, facts: Record<string, unknown>) {
  const findings: Array<Record<string, string>> = [];
  const pushFinding = (type: string, label: string, detail: string, page?: string | null) => {
    findings.push({
      type,
      label,
      detail,
      ...(page ? { page } : {}),
    });
  };

  if (facts.homepageReachable) {
    pushFinding("passed", "Homepage reachable", "The homepage returned a successful response.", String(facts.homepageUrl || ""));
  } else {
    pushFinding("risk", "Homepage not reachable", "Crozora could not get a healthy response from the homepage.", String(facts.homepageUrl || ""));
  }

  if (facts.httpsDetected) {
    pushFinding("passed", "HTTPS detected", "The website uses HTTPS on the scanned homepage.", String(facts.homepageUrl || ""));
  } else {
    pushFinding("attention", "HTTPS not detected", "Move the website to HTTPS before going further with verification.", String(facts.homepageUrl || ""));
  }

  if (facts.contactSignalFound) {
    pushFinding("passed", "Contact signal found", "A contact page, business email, or phone number was visible.", String(facts.contactPage || facts.homepageUrl || ""));
  } else {
    pushFinding("attention", "Contact signal missing", "Add a clear contact page, email address, or phone number.", String(facts.homepageUrl || ""));
  }

  if (facts.privacyPolicyFound) {
    pushFinding("passed", "Privacy policy found", "A privacy policy page was detected.", String(facts.privacyPage || ""));
  } else {
    pushFinding("attention", "Privacy policy missing", "Add a visible privacy policy page.", String(facts.homepageUrl || ""));
  }

  if (facts.termsPolicyFound) {
    pushFinding("passed", "Terms or policy page found", "Terms, refund, or service policy details were detected.", String(facts.termsPage || ""));
  } else {
    pushFinding("attention", "Terms or policy page missing", "Add service terms, cancellation details, or a refund policy.", String(facts.homepageUrl || ""));
  }

  if (facts.aboutPageFound) {
    pushFinding("passed", "About page found", "An about or company page was detected.", String(facts.aboutPage || ""));
  }

  if (facts.parkedDomainIndicators) {
    pushFinding("risk", "Parked domain indicators found", "The homepage looked more like a placeholder or parked domain than a live business site.", String(facts.homepageUrl || ""));
  }

  if (facts.urgencyLanguageDetected) {
    pushFinding("attention", "Urgency language detected", "The homepage includes pressure-heavy wording that may reduce trust.", String(facts.homepageUrl || ""));
  }

  if (facts.fakeBadgeLanguageDetected) {
    pushFinding("attention", "Questionable trust wording detected", "The site uses trust wording that may feel exaggerated to visitors.", String(facts.homepageUrl || ""));
  }

  if (input.reviewUrl || facts.reviewSignalFound) {
    pushFinding("passed", "Review signal found", "A review or external reputation signal was detected.", input.reviewUrl || null);
  }

  return findings;
}

function buildRecommendations(facts: Record<string, unknown>, planLevel: PlanLevel) {
  const recommendations: Array<Record<string, string>> = [];

  if (!facts.contactSignalFound) {
    recommendations.push({
      title: "Add a clear contact method",
      detail: "Publish a contact page, business email, or phone number so visitors know how to reach you.",
      priority: "high",
    });
  }

  if (!facts.privacyPolicyFound) {
    recommendations.push({
      title: "Publish a privacy policy",
      detail: "A visible privacy policy helps explain how customer data is handled.",
      priority: "high",
    });
  }

  if (!facts.termsPolicyFound) {
    recommendations.push({
      title: "Add service terms or a refund policy",
      detail: "Simple terms or cancellation details make the business feel more established and transparent.",
      priority: "medium",
    });
  }

  if (!facts.aboutPageFound) {
    recommendations.push({
      title: "Add an about page",
      detail: "Explain who runs the business, what you do, and who you help.",
      priority: "medium",
    });
  }

  if (planLevel === "advanced" && !facts.reviewSignalFound) {
    recommendations.push({
      title: "Strengthen off-site reputation signals",
      detail: "Claim and link a review profile or social proof source so visitors can validate your business elsewhere.",
      priority: "medium",
    });
  }

  if (planLevel === "advanced" && !facts.pricingSignalFound) {
    recommendations.push({
      title: "Clarify pricing or quote flow",
      detail: "Explain how visitors get pricing, quotes, or bookings so the buying process feels transparent.",
      priority: "low",
    });
  }

  return recommendations;
}

function buildReport(input: ScanInput, reportStatus: string, facts: Record<string, unknown>, findings: Array<Record<string, string>>, planLevel: PlanLevel, score: number) {
  const previewTitleMap: Record<string, string> = {
    looks_promising: "Your website shows early trust signals",
    needs_improvement: "Your website needs a few stronger trust signals",
    needs_closer_review: "Your website needs closer review",
  };

  const previewSummaryMap: Record<string, string> = {
    looks_promising: "Crozora found encouraging public trust signals on this website. The site looks reachable, reasonably clear, and ready for a deeper paid review.",
    needs_improvement: "Crozora found some positive trust signals, but several important public signals are still missing or unclear.",
    needs_closer_review: "Crozora found limited public trust signals on this website, or the homepage did not behave like a healthy business website.",
  };

  if (planLevel === "free") {
    return {
      reportLevel: "free",
      title: previewTitleMap[reportStatus] || previewTitleMap.needs_improvement,
      summary: previewSummaryMap[reportStatus] || previewSummaryMap.needs_improvement,
      score: null,
      status: "complete",
      sections: [
        {
          id: "summary",
          title: "Trust Summary",
          visibility: "private",
          content: previewSummaryMap[reportStatus] || previewSummaryMap.needs_improvement,
          severity: reportStatus === "looks_promising" ? "info" : reportStatus === "needs_improvement" ? "warning" : "alert",
        },
        {
          id: "signals",
          title: "Visible Signals Reviewed",
          visibility: "private",
          content: `Crozora reviewed public signals for ${input.domain || input.websiteUrl}.`,
          findings,
        },
      ],
      recommendations: [],
      aiSummary: null,
    };
  }

  const decisionLabel = reportStatus === "approved" ? "passed Crozora's current verification checks" : "did not yet pass Crozora's current verification checks";
  const paidSections = [
    {
      id: "summary",
      title: "Verification Summary",
      visibility: "private",
      content: `This website ${decisionLabel}. Crozora reviewed visible public trust signals, business clarity, and policy coverage for ${input.domain || input.websiteUrl}.`,
      severity: reportStatus === "approved" ? "info" : "warning",
    },
    {
      id: "ownership",
      title: "Website Ownership",
      visibility: "private",
      status: input.ownershipVerified ? "passed" : "needs_attention",
      findings: [
        {
          page: input.domain || input.websiteUrl || "",
          issue: input.ownershipVerified ? "Ownership verification is on file." : "Ownership verification should be completed before approval.",
          why_it_matters: "Crozora uses website ownership as part of its trust verification process.",
          suggested_fix: input.ownershipVerified ? "Keep your domain connected and active." : "Finish DNS TXT verification and wait for the record to appear.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact & Business Clarity",
      visibility: "private",
      status: facts.contactSignalFound ? "passed" : "needs_improvement",
      findings: findings
        .filter((item) => ["Contact signal found", "Contact signal missing", "About page found"].includes(item.label))
        .map((item) => ({
          page: item.page || facts.homepageUrl || "",
          issue: item.detail,
          why_it_matters: "Customers are more likely to trust a business when contact and operator details are easy to verify.",
          suggested_fix: item.label === "Contact signal missing"
            ? "Add a contact page, business email, phone number, or a clear service area description."
            : "Keep this information visible and up to date.",
        })),
    },
    {
      id: "policies",
      title: "Policies & Customer Expectations",
      visibility: "private",
      status: facts.privacyPolicyFound && facts.termsPolicyFound ? "passed" : "needs_improvement",
      findings: findings
        .filter((item) => ["Privacy policy found", "Privacy policy missing", "Terms or policy page found", "Terms or policy page missing"].includes(item.label))
        .map((item) => ({
          page: item.page || facts.homepageUrl || "",
          issue: item.detail,
          why_it_matters: "Policy pages help customers understand how your business works and what to expect.",
          suggested_fix: item.label.includes("missing")
            ? "Publish a visible policy page and link it from the footer or navigation."
            : "Keep policy language simple and easy to find.",
        })),
    },
  ];

  return {
    reportLevel: "advanced",
    title: reportStatus === "approved" ? "Advanced trust report: approved" : "Advanced trust report: improvements needed",
    summary: reportStatus === "approved"
      ? "This website passed Crozora's current verification checks and now has an advanced technical report available."
      : "This website did not pass Crozora's current verification checks yet. The advanced report below prioritizes the most important fixes.",
    score,
    status: "complete",
    sections: [
      {
        id: "summary",
        title: "Advanced Summary",
        visibility: "private",
        content: `Crozora reviewed ${input.domain || input.websiteUrl} using an advanced plan pass with page-level trust and policy checks.`,
        severity: reportStatus === "approved" ? "info" : "warning",
      },
      {
        id: "ownership",
        title: "Website Ownership & Security",
        visibility: "private",
        status: input.ownershipVerified && facts.httpsDetected ? "passed" : "needs_improvement",
        findings: [
          {
            page: facts.homepageUrl || input.websiteUrl || "",
            issue: input.ownershipVerified ? "Ownership verification is complete." : "Ownership verification is still needed.",
            why_it_matters: "Crozora uses verified ownership to make sure the right person controls the website.",
            suggested_fix: input.ownershipVerified ? "No action needed." : "Finish DNS TXT verification.",
          },
          {
            page: facts.homepageUrl || input.websiteUrl || "",
            issue: facts.httpsDetected ? "HTTPS is enabled." : "HTTPS is not enabled.",
            why_it_matters: "HTTPS helps protect visitors and signals a more trustworthy setup.",
            suggested_fix: facts.httpsDetected ? "Keep SSL active and renew certificates before expiration." : "Enable HTTPS and redirect HTTP traffic to the secure version.",
          },
        ],
      },
      {
        id: "content",
        title: "Customer Trust Signals",
        visibility: "private",
        status: reportStatus === "approved" ? "passed" : "needs_improvement",
        findings: [
          ...paidSections
            .filter((section) => section.id === "contact" || section.id === "policies")
            .flatMap((section) => section.findings || []),
          ...findings.map((item) => ({
            page: item.page || facts.homepageUrl || "",
            issue: item.detail,
            why_it_matters: "Visible trust signals affect whether new visitors feel safe contacting or buying from the business.",
            suggested_fix: item.type === "passed" ? "Keep this signal visible." : "Strengthen or add this signal on the referenced page.",
          })),
        ],
      },
      {
        id: "implementation",
        title: "Implementation Guidance",
        visibility: "private",
        status: "info",
        findings: buildRecommendations(facts, planLevel).map((item) => ({
          page: facts.homepageUrl || input.websiteUrl || "",
          issue: item.title,
          why_it_matters: item.detail,
          suggested_fix: item.detail,
        })),
      },
    ],
    recommendations: buildRecommendations(facts, planLevel),
    aiSummary: null,
  };
}

function recommendationTopic(item: Record<string, string>) {
  const text = `${String(item.title || "")} ${String(item.detail || "")}`.toLowerCase();
  if (text.includes("privacy")) return "privacy";
  if (text.includes("terms") || text.includes("refund") || text.includes("cancellation")) return "terms";
  if (text.includes("about")) return "about";
  if (text.includes("contact")) return "contact";
  if (text.includes("review") || text.includes("social proof") || text.includes("reputation")) return "reviews";
  if (text.includes("pricing") || text.includes("quote")) return "pricing";
  if (text.includes("https") || text.includes("ssl")) return "https";
  if (text.includes("ownership") || text.includes("dns")) return "ownership";
  return text.replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80) || "misc";
}

function dedupeRecommendations(base: Array<Record<string, string>>, extra: Array<Record<string, string>>) {
  const combined = [...base, ...extra];
  const topicMap = new Map<string, Record<string, string>>();
  const exactSeen = new Set<string>();

  for (const item of combined) {
    const exactKey = `${String(item.title || "").toLowerCase()}|${String(item.detail || "").toLowerCase()}`;
    if (!exactKey || exactSeen.has(exactKey)) continue;
    exactSeen.add(exactKey);

    const topic = recommendationTopic(item);
    if (!topicMap.has(topic)) {
      topicMap.set(topic, item);
    }
  }

  return Array.from(topicMap.values()).slice(0, 8);
}

async function maybeApplyAiAugmentation(
  input: ScanInput,
  report: ReturnType<typeof buildReport>,
  reportStatus: string,
  facts: Record<string, unknown>,
  findings: Array<Record<string, string>>,
  score: number,
) {
  try {
    const ai = await generateAiReportAugmentation({
      planLevel: input.planLevel || "free",
      domain: input.domain || normalizeDomain(input.websiteUrl),
      businessName: input.businessName,
      overallStatus: reportStatus,
      score: report.score ?? score ?? null,
      findings,
      facts,
    });

    if (!ai) {
      return report;
    }

    const nextSections = [...(report.sections || [])];
    if (Array.isArray(ai.sections) && ai.sections.length) {
      nextSections.push(
        ...ai.sections.map((section) => ({
          id: section.id,
          title: section.title,
          visibility: "private",
          content: section.content,
          severity: section.severity || "info",
        })),
      );
    }

    const nextRecommendations = dedupeRecommendations(
      report.recommendations || [],
      ai.recommendations || [],
    );

    return {
      ...report,
      summary: ai.summary || report.summary,
      aiSummary: ai.summary || report.aiSummary || null,
      sections: nextSections,
      recommendations: nextRecommendations,
    };
  } catch (error) {
    console.warn("AI augmentation skipped:", error instanceof Error ? error.message : error);
    return report;
  }
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const input = await request.json() as ScanInput;
    const scanMode = input.planLevel === "free" ? "free" : "paid";
    const access = await resolveWebsiteAccess(request, { websiteId: input.websiteId }, scanMode);
    const storedBusiness = access.website.businesses;
    const planLevel = access.planLevel;
    const domain = normalizeDomain(access.website.normalized_domain || access.website.website_url);
    const homepageUrl = normalizeWebsiteUrl(access.website.website_url || access.website.normalized_domain);

    if (!domain || !homepageUrl) {
      return json({ error: "A valid website domain is required." }, { status: 400 });
    }

    const homepage = await fetchPage(homepageUrl);
    const bundleSignals = await fetchBundleRouteSignals(homepage);
    const combinedTextParts = [homepage.text];
    const pageMap: Record<string, string | null> = {
      homepage: homepage.finalUrl,
      contact: access.website.contact_page_url
        || findInternalCandidate(homepage, ["contact", "support", "help"])
        || findRouteCandidate(bundleSignals.routePaths, homepage.finalUrl, ["contact", "support", "help"]),
      privacy: access.website.privacy_policy_url
        || findInternalCandidate(homepage, ["privacy"])
        || findRouteCandidate(bundleSignals.routePaths, homepage.finalUrl, ["privacy"]),
      terms: access.website.terms_policy_url
        || findInternalCandidate(homepage, ["terms", "refund", "policy", "cancellation"])
        || findRouteCandidate(bundleSignals.routePaths, homepage.finalUrl, ["terms", "refund", "policy", "cancellation"]),
      about: findInternalCandidate(homepage, ["about", "team", "company"])
        || findRouteCandidate(bundleSignals.routePaths, homepage.finalUrl, ["about", "team", "company"]),
      pricing: findInternalCandidate(homepage, ["pricing", "plans", "quote", "services"])
        || findRouteCandidate(bundleSignals.routePaths, homepage.finalUrl, ["pricing", "plans", "quote", "services"]),
    };

    const extraTargets = Array.from(
      new Set(Object.values(pageMap).filter((value): value is string => Boolean(value && value !== homepage.finalUrl))),
    ).slice(0, 4);

    const extraPages = await Promise.all(
      extraTargets.map(async (url) => {
        try {
          return await fetchPage(url);
        } catch {
          return null;
        }
      }),
    );

    const successfulExtraPages = extraPages.filter((page): page is PageSnapshot => Boolean(page));
    successfulExtraPages.forEach((page) => combinedTextParts.push(page.text));
    const allText = combinedTextParts.join(" ").toLowerCase();
    const allLinks = Array.from(new Set([homepage.links, ...successfulExtraPages.map((page) => page.links)].flat()));
    const allEmails = Array.from(new Set([homepage.emails, ...successfulExtraPages.map((page) => page.emails)].flat()));
    const allPhones = Array.from(new Set([homepage.phones, ...successfulExtraPages.map((page) => page.phones)].flat()));

    const facts = {
      homepageUrl: homepage.finalUrl,
      homepageReachable: homepage.ok,
      httpsDetected: homepage.finalUrl.startsWith("https://"),
      homepageStatus: homepage.status,
      homepageTitleFound: Boolean(homepage.title),
      metaDescriptionFound: Boolean(homepage.metaDescription),
      parkedDomainIndicators: includesAny(allText, ["domain for sale", "buy this domain", "coming soon", "parked free", "sedo", "afternic"]),
      brokenHomepageResponse: homepage.status >= 500,
      clientRenderedShellDetected: homepage.likelyClientShell,
      contactSignalFound: Boolean(pageMap.contact || allEmails.length || allPhones.length || storedBusiness?.business_email || bundleSignals.hasContactSignal),
      privacyPolicyFound: Boolean(pageMap.privacy || bundleSignals.hasPrivacySignal || includesAny(allText, ["privacy policy", "privacy notice"])),
      termsPolicyFound: Boolean(pageMap.terms || bundleSignals.hasTermsSignal || includesAny(allText, ["terms of service", "refund policy", "cancellation policy"])),
      aboutPageFound: Boolean(pageMap.about || bundleSignals.hasAboutSignal || includesAny(allText, ["about us", "who we are", "our story"])),
      pricingSignalFound: Boolean(pageMap.pricing || bundleSignals.hasPricingSignal) || includesAny(allText, ["pricing", "quote", "book now", "schedule"]),
      reviewSignalFound: Boolean(access.website.review_profile_url || bundleSignals.hasReviewSignal) || allLinks.some((link) => includesAny(link, ["google.com", "yelp.com", "facebook.com", "trustpilot.com"])),
      socialLinksFound: allLinks.filter((link) => includesAny(link, ["facebook.com", "instagram.com", "linkedin.com", "x.com", "youtube.com"])),
      urgencyLanguageDetected: includesAny(allText, ["act now", "limited time", "urgent", "instant approval", "guaranteed results"]),
      fakeBadgeLanguageDetected: includesAny(allText, ["trusted seal", "verified safe", "100% safe", "scam free"]),
      businessNameVisible: Boolean(storedBusiness?.business_name) && allText.includes(String(storedBusiness.business_name).toLowerCase()),
      emailSignals: allEmails,
      phoneSignals: allPhones,
      contactPage: pageMap.contact,
      privacyPage: pageMap.privacy,
      termsPage: pageMap.terms,
      aboutPage: pageMap.about,
      pricingPage: pageMap.pricing,
      scannedPages: {
        homepage: homepage.finalUrl,
        contact: pageMap.contact,
        privacy: pageMap.privacy,
        terms: pageMap.terms,
        about: pageMap.about,
        pricing: pageMap.pricing,
      },
      bundleRouteSignals: bundleSignals.routePaths,
    };

    const previewStatus = buildPreviewStatus({
      reachable: facts.homepageReachable,
      https: facts.httpsDetected,
      contactSignal: facts.contactSignalFound,
      privacySignal: facts.privacyPolicyFound,
      termsSignal: facts.termsPolicyFound,
      aboutSignal: facts.aboutPageFound,
      reviewSignal: facts.reviewSignalFound,
      parked: facts.parkedDomainIndicators,
      broken: facts.brokenHomepageResponse,
      urgencyRisk: facts.urgencyLanguageDetected || facts.fakeBadgeLanguageDetected,
    });

    const score = buildScore(facts);
    const reportStatus = planLevel === "free" ? previewStatus : buildPaidDecision(facts, score);
    const serverInput = {
      ...input,
      domain,
      websiteUrl: homepageUrl,
      businessName: storedBusiness?.business_name || input.businessName,
      businessEmail: storedBusiness?.business_email || input.businessEmail,
      category: storedBusiness?.category || input.category,
      serviceType: storedBusiness?.service_type || input.serviceType,
      country: storedBusiness?.country || input.country,
      stateRegion: storedBusiness?.state_region || input.stateRegion,
      city: storedBusiness?.city || input.city,
      contactUrl: access.website.contact_page_url || input.contactUrl,
      privacyUrl: access.website.privacy_policy_url || input.privacyUrl,
      termsUrl: access.website.terms_policy_url || input.termsUrl,
      reviewUrl: access.website.review_profile_url || input.reviewUrl,
      ownershipVerified: access.website.ownership_status === "verified",
      planLevel,
    };

    const findings = buildFindings(serverInput, facts);
    const report = await maybeApplyAiAugmentation(
      serverInput,
      buildReport(serverInput, reportStatus, facts, findings, planLevel, score),
      reportStatus,
      facts,
      findings,
      score,
    );

    return json({
      overallStatus: reportStatus,
      score,
      findings,
      rawScanData: {
        mode: "edge_function",
        planLevel,
        entitlementType: access.entitlementType,
        websiteId: access.website.id,
        domain,
        homepage: {
          url: homepage.finalUrl,
          status: homepage.status,
          title: homepage.title,
          metaDescription: homepage.metaDescription,
        },
        facts,
      },
      report,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected scan failure." },
      { status: 500 },
    );
  }
});
