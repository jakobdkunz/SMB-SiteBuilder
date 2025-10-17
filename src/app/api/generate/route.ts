import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSiteSchemaFromSummary } from "@/lib/ai";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const summary: string = body?.summary || "Local business website";
  const siteId = randomUUID();
  const schema = await generateSiteSchemaFromSummary(summary, siteId);
  // For MVP, store in-memory map via a global (replace with Convex shortly)
  (global as any).__SITES__ = (global as any).__SITES__ || new Map<string, any>();
  (global as any).__SITES__.set(siteId, { ...schema, siteId, ownerId: userId });
  return NextResponse.json({ siteId });
}


