import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { siteId: string } }) {
  const store: Map<string, any> | undefined = (global as any).__SITES__;
  const site = store?.get(params.siteId);
  if (!site) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(site);
}


