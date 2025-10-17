import SiteRenderer from "@/components/SiteRenderer";
import { SiteSchema } from "@/lib/siteSchema";

async function getSite(siteId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/sites/${siteId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const parsed = SiteSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export default async function PreviewPage({ params }: { params: { siteId: string } }) {
  const site = await getSite(params.siteId);
  if (!site) return <div className="max-w-3xl mx-auto p-8">Site not found.</div>;
  return (
    <div>
      <SiteRenderer blocks={site.blocks} />
    </div>
  );
}


