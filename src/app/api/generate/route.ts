import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSiteSchemaFromSummary } from "@/lib/ai";
import { randomUUID } from "crypto";
import { setSite } from "@/lib/store";
import { SiteSchema } from "@/lib/siteSchema";
import { getOrCreateGuestId } from "@/lib/guest";

export async function POST(req: Request) {
  const { userId } = await auth();

  const body = await req.json().catch(() => ({}));
  const summary: string = body?.summary || "Local business website";
  const siteId = randomUUID();
  const schema = await generateSiteSchemaFromSummary(summary, siteId);
  const ownerId = userId || await getOrCreateGuestId();
  const parsed = SiteSchema.parse({ ...schema, siteId, ownerId, title: schema?.seo?.title || "Untitled" });
  setSite(parsed);
  return NextResponse.json({ siteId });
}


