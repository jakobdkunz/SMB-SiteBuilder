import { NextResponse } from "next/server";
import { getSiteById, setSite } from "@/lib/store";
import { SiteSchema } from "@/lib/siteSchema";
import { generateObject } from "ai";
import { getModel } from "@/lib/ai";
import { z } from "zod";

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

  try {
    const { object } = await generateObject({
      model,
      schema: EditSchema,
      messages: [
        { role: "system", content: "You are a website code editor. Given the current site object and a user request, update the site. Return ONLY JSON with { site, explanation }. Keep bright, fun style. For code-based pages, modify html/css. Keep links consistent across pages." },
        { role: "user", content: `Current site (JSON): ${JSON.stringify(site)}` },
        { role: "user", content: `Request: ${message}` },
      ],
    });
    const out = EditSchema.parse(object);
    setSite(out.site);
    return NextResponse.json({ siteId, explanation: out.explanation });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || "Failed to edit site" }, { status: 500 });
  }
}


