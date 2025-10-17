import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

export type ProviderName = "openai" | "anthropic" | "gemini";

export function getModel() {
  const provider = (process.env.AI_PROVIDER || "openai") as ProviderName;
  const modelName = process.env.AI_MODEL || (
    provider === "openai" ? "gpt-4o-mini" : provider === "anthropic" ? "claude-3-5-sonnet-latest" : "gemini-1.5-flash"
  );
  if (provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
    return anthropic(modelName);
  }
  if (provider === "gemini") {
    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "" });
    return google(modelName);
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return openai(modelName);
}

function hasAIConfig(): boolean {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  if (provider === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === "gemini") return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  return Boolean(process.env.OPENAI_API_KEY);
}

function getProvider(): ProviderName {
  const p = (process.env.AI_PROVIDER || "openai").toLowerCase();
  if (p === "anthropic" || p === "gemini" || p === "openai") return p as ProviderName;
  return "openai";
}

export const SiteSchema = z.object({
  siteId: z.string(),
  theme: z.object({
    primary: z.string(),
    accent: z.string().optional(),
    fontFamily: z.string().default("Inter"),
  }),
  seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
  blocks: z.array(z.object({
    id: z.string(),
    type: z.enum(["hero","features","services","testimonials","contact","footer"]),
    variant: z.string().default("default"),
    props: z.record(z.string(), z.any()).default({}),
  })),
});

function buildFallbackTemplate(summary: string, siteId: string) {
  return {
    siteId,
    theme: { primary: "#111111", accent: "#6EE7B7", fontFamily: "Inter" },
    seo: { title: "Your New Website", description: summary?.slice(0, 140) || "" },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        variant: "imageRight",
        props: {
          headline: "We help local businesses grow",
          subheadline: summary || "Beautiful, fast websites built for conversions.",
          primaryCta: { label: "Get a Quote", href: "/contact" },
          image: { src: "/placeholder.png", alt: "Website preview" },
        },
      },
      {
        id: "contact-1",
        type: "contact",
        variant: "split",
        props: { phone: "(555) 000-0000", email: "hello@example.com", address: "123 Main St" },
      },
    ],
  } as z.infer<typeof SiteSchema>;
}

export async function generateSiteSchemaFromSummary(summary: string, siteId: string) {
  if (!hasAIConfig()) {
    // Fallback deterministic template so the app works without API keys
    return buildFallbackTemplate(summary, siteId);
  }

  const provider = getProvider();
  const model = getModel();

  // Gemini is strict about response_schema object properties; relax props typing for generation
  const GeminiBlockSchema = z.object({
    id: z.string(),
    type: z.enum(["hero","features","services","testimonials","contact","footer"]),
    variant: z.string().default("default"),
    props: z.any(),
  });
  const GeminiSiteSchema = z.object({
    siteId: z.string(),
    theme: z.object({
      primary: z.string(),
      accent: z.string().optional(),
      fontFamily: z.string().default("Inter"),
    }),
    seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
    blocks: z.array(GeminiBlockSchema),
  });

  const targetSchema = provider === "gemini" ? GeminiSiteSchema : SiteSchema;
  try {
    const { object } = await generateObject({
      model,
      schema: targetSchema,
      messages: [
        {
          role: "system",
          content:
            "You generate JSON for a small business website using a fixed block library. Return only JSON conforming to the provided schema. Keep arrays short (<=4). Total blocks <= 5.",
        },
        {
          role: "user",
          content: `Business summary: ${summary}. Create a site with 3-5 blocks and a strong hero. Use siteId ${siteId}. Do not include invalid JSON; ensure arrays are proper JSON arrays, no stray quotes.`,
        },
      ],
      maxTokens: 1500,
    });
    // Validate final result against our stricter schema to keep renderer safe
    const parsed = SiteSchema.safeParse(object);
    return parsed.success ? parsed.data : (object as unknown as z.infer<typeof SiteSchema>);
  } catch (_err) {
    // If model fails or returns malformed JSON, fall back
    return buildFallbackTemplate(summary, siteId);
  }
}


