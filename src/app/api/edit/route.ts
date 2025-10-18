import { NextResponse } from "next/server";
import { getSiteById, setSite } from "@/lib/store";
import { BlockTypeEnum, SiteSchema } from "@/lib/siteSchema";
import { generateObject } from "ai";
import { getModel } from "@/lib/ai";
import { z } from "zod";
import { convex } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

const EditRequestSchema = z.object({
  siteId: z.string(),
  message: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = EditRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { siteId, message } = parsed.data;
  const site = getSiteById(siteId);
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const model = getModel();

  const EditSchema = z.object({
    site: SiteSchema,
    explanation: z.string(),
  });
  // Gemini requires object properties to be explicitly declared; relax props typing
  const GeminiBlockSchema = z.object({
    id: z.string(),
    type: BlockTypeEnum,
    variant: z.string().default("default"),
    props: z.any(),
  });
  const GeminiSiteSchema = z.object({
    _id: z.string().optional(),
    siteId: z.string(),
    ownerId: z.string().optional(),
    title: z.string().default("Untitled"),
    seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
    theme: z.object({
      primary: z.string(),
      accent: z.string().optional(),
      fontFamily: z.string().default("Inter"),
    }),
    code: z.object({ html: z.string(), css: z.string().optional() }).optional(),
    pages: z.array(z.object({ path: z.string(), title: z.string().optional(), code: z.object({ html: z.string(), css: z.string().optional() }) })).default([]),
    blocks: z.array(GeminiBlockSchema).default([]),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
  });
  const GeminiEditSchema = z.object({ site: GeminiSiteSchema, explanation: z.string() });

  try {
    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
    const targetSchema = provider === "gemini" ? GeminiEditSchema : EditSchema;
    const { object } = await generateObject({
      model,
      schema: targetSchema,
      messages: [
        { role: "system", content: "You are a website code editor. Given the current site object and a user request, update the site. Return ONLY JSON with { site, explanation }. Keep bright, fun style. For code-based pages, modify html/css. Keep links consistent across pages." },
        { role: "user", content: `Current site (JSON): ${JSON.stringify(site)}` },
        { role: "user", content: `Request: ${message}` },
      ],
    });
    const out = (provider === "gemini" ? GeminiEditSchema.parse(object) : EditSchema.parse(object));
    const parsedSite = SiteSchema.parse(out.site);
    setSite(parsedSite);
    try {
      await convex.mutation(api.sites.setSite, { site: parsedSite });
    } catch {}
    return NextResponse.json({ siteId, explanation: out.explanation });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || "Failed to edit site" }, { status: 500 });
  }
}


