import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSiteSchemaFromSummary } from "@/lib/ai";
import { randomUUID } from "crypto";
import { setSite } from "@/lib/store";
import { SiteSchema } from "@/lib/siteSchema";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const summary: string = body?.summary || "Local business website";
  const siteId = randomUUID();
  const schema = await generateSiteSchemaFromSummary(summary, siteId);
  const parsed = SiteSchema.parse({ ...schema, siteId, ownerId: userId, title: schema?.seo?.title || "Untitled" });
  setSite(parsed);
  return NextResponse.json({ siteId });
}


