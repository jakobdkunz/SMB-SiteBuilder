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
  const isPizza = /pizza/i.test(summary || "");
  return {
    siteId,
    theme: { primary: "#0a0a0a", accent: "#f97316", fontFamily: "Inter" },
    seo: { title: isPizza ? "Pizza Shop" : "Your New Website", description: summary?.slice(0, 140) || "" },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        variant: "imageRight",
        props: {
          headline: isPizza ? "Hot, fresh pizza. Open 24/7." : "We help local businesses grow",
          subheadline: summary || "Beautiful, fast websites built for conversions.",
          primaryCta: { label: isPizza ? "Order Now" : "Get a Quote", href: isPizza ? "#services" : "/contact" },
          image: { src: "/window.svg", alt: "Preview" },
        },
      },
      {
        id: "features-1",
        type: "features",
        variant: "cards",
        props: {
          title: isPizza ? "Why choose our pizza?" : "Why choose us?",
          items: [
            { title: isPizza ? "Cheese" : "Fast", description: isPizza ? "Classic mozzarella goodness." : "Quick turnaround.", icon: "🧀" },
            { title: isPizza ? "Pepperoni" : "Quality", description: isPizza ? "Everyone’s favorite topping." : "High-quality design.", icon: "🍕" },
            { title: isPizza ? "Delivery" : "Support", description: isPizza ? "$15 delivery available." : "We’re here when you need us.", icon: isPizza ? "🚗" : "💬" },
          ],
        },
      },
      {
        id: "services-1",
        type: "services",
        variant: "list",
        props: {
          title: isPizza ? "Menu" : "Services",
          items: isPizza
            ? [
                { name: "Cheese Pizza", description: "12\" classic cheese", price: "$10" },
                { name: "Pepperoni Pizza", description: "12\" pepperoni", price: "$12" },
                { name: "Delivery", description: "Local delivery", price: "$15" },
              ]
            : [
                { name: "Website", description: "Design and build", price: "Custom" },
                { name: "SEO", description: "Get found online", price: "Custom" },
              ],
        },
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        variant: "grid",
        props: {
          title: "What customers say",
          items: [
            { quote: isPizza ? "Best late-night pizza in town!" : "Amazing results.", author: "Happy Customer" },
            { quote: isPizza ? "Fast delivery and great taste." : "Great support.", author: "Local Regular" },
          ],
        },
      },
      {
        id: "contact-1",
        type: "contact",
        variant: "split",
        props: { phone: "555-PIZZA-NOW", email: "order@pizzashop.com", address: "123 Main St" },
      },
      {
        id: "footer-1",
        type: "footer",
        variant: "simple",
        props: { copyright: "© 2025 Pizza Shop", links: [{ label: "Contact", href: "#contact" }] },
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
            "You are a website block composer. Output ONLY JSON matching the provided schema. Use 4-5 blocks: hero, features OR services, testimonials, contact, and optional footer. Fill props with realistic content. For a pizza shop, include cheese and pepperoni menu items and a delivery option with price.",
        },
        {
          role: "user",
          content: `Business summary: ${summary}. Use siteId ${siteId}. Ensure valid JSON only. Provide concrete props for each block.`,
        },
      ],
    });
    // Validate final result against our stricter schema to keep renderer safe
    const parsed = SiteSchema.safeParse(object);
    return parsed.success ? parsed.data : (object as unknown as z.infer<typeof SiteSchema>);
  } catch {
    // If model fails or returns malformed JSON, fall back
    return buildFallbackTemplate(summary, siteId);
  }
}


