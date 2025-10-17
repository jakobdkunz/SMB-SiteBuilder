import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSiteSchemaFromSummary } from "@/lib/ai";
import { setSite } from "@/lib/store";
import { SiteSchema } from "@/lib/siteSchema";
import { getOrCreateGuestId } from "@/lib/guest";

export async function POST(req: Request) {
  let userId: string | null = null;
  try {
    const authCtx = await auth();
    userId = authCtx.userId;
  } catch {
    userId = null; // proceed as guest if middleware context isn't present
  }

  const body = await req.json().catch(() => ({}));
  const summary: string = body?.summary || "Local business website";
  const siteId = crypto.randomUUID();
  try {
    const schema = await generateSiteSchemaFromSummary(summary, siteId);
    const ownerId = userId || await getOrCreateGuestId();
    const parsed = SiteSchema.parse({ ...schema, siteId, ownerId, title: schema?.seo?.title || "Untitled" });
    setSite(parsed);
    return NextResponse.json({ siteId });
  } catch (err) {
    console.error("/api/generate error", err);
    return NextResponse.json({ error: "Failed to generate site" }, { status: 500 });
  }
}


