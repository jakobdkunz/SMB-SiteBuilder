import { NextRequest, NextResponse } from "next/server";
import { getSiteById, loadSite } from "@/lib/store";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";

export async function GET(_req: NextRequest, context: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await context.params;
  let site = getSiteById(siteId);
  if (!site) {
    try {
      site = await convex.query(api.sites.getSiteById, { siteId });
    } catch {}
  }
  if (!site) site = await loadSite(siteId);
  if (!site) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(site);
}


