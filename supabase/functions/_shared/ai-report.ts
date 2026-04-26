type PlanLevel = "free" | "advanced";

type Recommendation = {
  title: string;
  detail: string;
  priority?: string;
};

type AiSection = {
  id: string;
  title: string;
  content: string;
  severity?: string;
};

type AiResponse = {
  summary?: string;
  recommendations?: Recommendation[];
  sections?: AiSection[];
};

type AiFollowupResponse = {
  message?: string;
  nextAction?: string;
};

type GenerateAiInput = {
  planLevel: PlanLevel;
  domain: string;
  businessName?: string;
  overallStatus: string;
  score?: number | null;
  findings: Array<Record<string, string>>;
  facts: Record<string, unknown>;
};

type AiRuntimeConfig = {
  apiKey: string | null;
  baseUrl: string;
  primaryModel: string | null;
  fastModel: string | null;
  guardModel: string | null;
};

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    const start = value.indexOf("{");
    const end = value.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(value.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeRecommendations(items: unknown) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const title = String(candidate.title || "").trim();
      const detail = String(candidate.detail || "").trim();
      const priority = String(candidate.priority || "medium").trim().toLowerCase();

      if (!title || !detail) return null;

      return {
        title,
        detail,
        priority: ["high", "medium", "low"].includes(priority) ? priority : "medium",
      };
    })
    .filter((item): item is Recommendation => Boolean(item));
}

function normalizeSections(items: unknown) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const title = String(candidate.title || "").trim();
      const content = String(candidate.content || "").trim();
      const severity = String(candidate.severity || "info").trim().toLowerCase();

      if (!title || !content) return null;

      return {
        id: String(candidate.id || `ai-section-${index + 1}`),
        title,
        content,
        severity: ["info", "warning", "alert"].includes(severity) ? severity : "info",
      };
    })
    .filter((item): item is AiSection => Boolean(item));
}

export function getAiRuntimeConfig(): AiRuntimeConfig {
  return {
    apiKey: Deno.env.get("AI_API_KEY"),
    baseUrl: (Deno.env.get("AI_BASE_URL") || "https://api.groq.com/openai/v1").replace(/\/$/, ""),
    primaryModel: Deno.env.get("AI_MODEL") || Deno.env.get("AI_MODEL_PRIMARY"),
    fastModel: Deno.env.get("AI_MODEL_FAST") || null,
    guardModel: Deno.env.get("AI_MODEL_GUARD") || null,
  };
}

export async function generateAiReportAugmentation(input: GenerateAiInput): Promise<AiResponse | null> {
  const config = getAiRuntimeConfig();
  const apiKey = config.apiKey;
  const model = config.primaryModel;
  const baseUrl = config.baseUrl;

  if (!apiKey || !model) {
    return null;
  }

  const systemPrompt = [
    "You are Crozora's trust report writing assistant.",
    "Never claim a website is 100% safe, scam-free, or guaranteed trustworthy.",
    "Use careful wording such as passed Crozora's checks, verified website ownership, public trust page active, and no major visible scam-risk signals detected.",
    "Write for business owners in plain language.",
    "Return strict JSON only.",
  ].join(" ");

  const userPrompt = JSON.stringify({
    task: "Summarize trust scan findings into business-friendly report copy.",
    output_format: {
      summary: "string",
      recommendations: [
        {
          title: "string",
          detail: "string",
          priority: "high|medium|low",
        },
      ],
      sections: [
        {
          id: "string",
          title: "string",
          content: "string",
          severity: "info|warning|alert",
        },
      ],
    },
    rules: {
      keep_plan_specific: true,
      do_not_invent_findings: true,
      avoid_absolute_guarantees: true,
      max_recommendations: input.planLevel === "advanced" ? 5 : 3,
      max_sections: input.planLevel === "advanced" ? 3 : 2,
    },
    context: {
      planLevel: input.planLevel,
      domain: input.domain,
      businessName: input.businessName || null,
      overallStatus: input.overallStatus,
      score: input.score ?? null,
      findings: input.findings,
      facts: input.facts,
    },
  });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    return null;
  }

  const parsed = safeJsonParse(content) as Record<string, unknown> | null;

  if (!parsed) {
    return null;
  }

  const summary = String(parsed.summary || "").trim() || undefined;
  const recommendations = normalizeRecommendations(parsed.recommendations);
  const sections = normalizeSections(parsed.sections);

  return {
    ...(summary ? { summary } : {}),
    ...(recommendations.length ? { recommendations } : {}),
    ...(sections.length ? { sections } : {}),
  };
}

export async function generateAiFollowupResponse(input: {
  domain: string;
  planLevel: "advanced";
  userMessage: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  improved: string[];
  stillMissing: string[];
}): Promise<AiFollowupResponse | null> {
  const config = getAiRuntimeConfig();
  const apiKey = config.apiKey;
  const model = config.fastModel || config.primaryModel;
  const baseUrl = config.baseUrl;

  if (!apiKey || !model) {
    return null;
  }

  const systemPrompt = [
    "You are Crozora's recheck follow-up assistant.",
    "Write a short update for a business owner after a recheck.",
    "Never claim 100% safety, scam-free guarantees, or certainty beyond the stored scan results.",
    "Use plain language and stay grounded in the comparison data provided.",
    "Return strict JSON only.",
  ].join(" ");

  const userPrompt = JSON.stringify({
    task: "Write a short follow-up message after a Crozora recheck.",
    output_format: {
      message: "string",
      nextAction: "string",
    },
    context: input,
  });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`AI follow-up request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return null;
  }

  const parsed = safeJsonParse(content) as Record<string, unknown> | null;
  if (!parsed) {
    return null;
  }

  const message = String(parsed.message || "").trim() || undefined;
  const nextAction = String(parsed.nextAction || "").trim() || undefined;

  return {
    ...(message ? { message } : {}),
    ...(nextAction ? { nextAction } : {}),
  };
}
