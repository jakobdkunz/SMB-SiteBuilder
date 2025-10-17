import { NextRequest, NextResponse } from "next/server";
import { getSiteById } from "@/lib/store";

export async function GET(_req: NextRequest, context: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await context.params;
  const site = getSiteById(siteId);
  if (!site) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(site);
}


