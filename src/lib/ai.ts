import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export type ProviderName = "openai" | "anthropic";

export function getModel() {
  const provider = (process.env.AI_PROVIDER || "openai") as ProviderName;
  const modelName = process.env.AI_MODEL || (provider === "openai" ? "gpt-4o-mini" : "claude-3-5-sonnet-latest");
  if (provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
    return anthropic(modelName);
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return openai(modelName);
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
    props: z.record(z.any()).default({}),
  })),
});

export async function generateSiteSchemaFromSummary(summary: string, siteId: string) {
  const model = getModel();
  const { object } = await generateObject({
    model,
    schema: SiteSchema,
    messages: [
      {
        role: "system",
        content:
          "You generate JSON for a small business website using a fixed block library. Return only JSON conforming to the provided schema.",
      },
      {
        role: "user",
        content: `Business summary: ${summary}. Create a site with 3-5 blocks and a strong hero. Use siteId ${siteId}.`,
      },
    ],
  });
  return object;
}


