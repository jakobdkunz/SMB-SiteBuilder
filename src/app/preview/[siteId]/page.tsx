export const dynamic = "force-dynamic";
import SiteRenderer from "@/components/SiteRenderer";
import { SiteSchema } from "@/lib/siteSchema";
import Script from "next/script";
import { headers } from "next/headers";
import { getAbsoluteBaseUrl } from "@/lib/url";

async function getSite(siteId: string) {
  const host = headers().get("host");
  const base = host ? `https://${host}` : (process.env.NEXT_PUBLIC_API_BASE || getAbsoluteBaseUrl());
  const res = await fetch(`${base}/api/sites/${siteId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const parsed = SiteSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export default async function PreviewPage({ params }: { params: { siteId: string } }) {
  const site = await getSite(params.siteId);
  if (!site) {
    // If server doesn't have it (guest flow), let client try to load from localStorage
    return (
      <>
        <Script id="smb-preview-load" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          try {
            const sid = localStorage.getItem('smb_last_site_id');
            if (sid && sid !== ${JSON.stringify(params.siteId)}) {
              location.replace('/preview/' + sid);
            }
          } catch {}
        ` }} />
        <div className="max-w-3xl mx-auto p-8">Site not found. If you recently generated a site, it may still be in your browser. Refresh or try again.</div>
      </>
    );
  }
  return (
    <div>
      <SiteRenderer blocks={site.blocks} />
    </div>
  );
}


