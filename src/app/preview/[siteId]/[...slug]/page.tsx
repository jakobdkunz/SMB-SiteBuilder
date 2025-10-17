import SiteRenderer from "@/components/SiteRenderer";
import { SiteSchema } from "@/lib/siteSchema";
import { headers } from "next/headers";
import { getAbsoluteBaseUrl } from "@/lib/url";

async function getSite(siteId: string) {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const base = host ? `https://${host}` : (process.env.NEXT_PUBLIC_API_BASE || getAbsoluteBaseUrl());
  const res = await fetch(`${base}/api/sites/${siteId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const parsed = SiteSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export default async function PreviewPage({ params }: { params: { siteId: string; slug?: string[] } }) {
  const site = await getSite(params.siteId);
  const slug = Array.isArray(params.slug) ? params.slug : [];
  const path = "/" + slug.join("/");
  if (!site) return <div className="max-w-3xl mx-auto p-8">Site not found.</div>;
  return (
    <div>
      <SiteRenderer site={site} currentPath={path} />
    </div>
  );
}


