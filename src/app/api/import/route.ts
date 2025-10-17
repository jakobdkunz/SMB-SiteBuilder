import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const url = body?.url as string | undefined;
  if (!url) return new NextResponse("URL required", { status: 400 });
  // TODO: enqueue scraping job with provider (stub for now)
  console.log("Import requested by", userId, "for", url);
  return NextResponse.json({ ok: true });
}


