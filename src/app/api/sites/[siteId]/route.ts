import { NextResponse } from "next/server";
import { getSiteById } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: { siteId: string } }) {
  const site = getSiteById(params.siteId);
  if (!site) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(site);
}


