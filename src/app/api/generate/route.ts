import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSiteSchemaFromSummary } from "@/lib/ai";
import { setSite, persistSite } from "@/lib/store";
import { convex } from "@/lib/convex";
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
  // Accept either plain summary or structured fields
  const {
    summary: plainSummary,
    businessName,
    tagline,
    description,
    services,
    menuItems,
    address,
    hours,
    colors,
    extra,
  } = body || {};

  const parts: string[] = [];
  if (businessName) parts.push(`Business name: ${businessName}`);
  if (tagline) parts.push(`Tagline: ${tagline}`);
  if (description) parts.push(`About: ${description}`);
  if (Array.isArray(services) && services.length) parts.push(`Services: ${services.join(", ")}`);
  if (Array.isArray(menuItems) && menuItems.length) parts.push(`Menu items: ${menuItems.join(", ")}`);
  if (address) parts.push(`Address: ${address}`);
  if (hours) parts.push(`Hours: ${hours}`);
  if (colors && (colors.primary || colors.accent)) parts.push(`Brand colors: primary=${colors.primary || ""}, accent=${colors.accent || ""}`);
  if (extra) parts.push(`Additional requests: ${extra}`);
  const summary: string = (parts.join("\n") || plainSummary || "Local business website");
  const siteId = crypto.randomUUID();
  try {
    const schema = await generateSiteSchemaFromSummary(summary, siteId);
    const ownerId = userId || await getOrCreateGuestId();
    const parsed = SiteSchema.parse({ ...schema, siteId, ownerId, title: schema?.seo?.title || "Untitled" });
    setSite(parsed);
    try {
      await convex.mutation("sites:setSite", { site: parsed });
    } catch {}
    try {
      await persistSite(parsed); // keep as optional fallback
    } catch {}
    return NextResponse.json({ siteId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/generate error", message);
    return NextResponse.json({ error: message || "Failed to generate site" }, { status: 500 });
  }
}


