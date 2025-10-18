import type { Site } from "@/lib/siteSchema";
import { put, get } from "@vercel/blob";

declare global {
  var __SITES__: Map<string, Site> | undefined;
}

export function getStore(): Map<string, Site> {
  if (!global.__SITES__) global.__SITES__ = new Map<string, Site>();
  return global.__SITES__;
}

export function setSite(site: Site): void {
  getStore().set(site.siteId, site);
}

export function getSiteById(siteId: string): Site | undefined {
  const mem = getStore().get(siteId);
  return mem;
}

// Durable persistence helpers; used by API route wrappers
export async function persistSite(site: Site): Promise<void> {
  try {
    await put(`sites/${site.siteId}.json`, new Blob([JSON.stringify(site)], { type: "application/json" }), { access: "public" });
  } catch {}
}

export async function loadSite(siteId: string): Promise<Site | undefined> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BLOB_BASE || ""}/sites/${siteId}.json`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return undefined;
    const data = (await res.json()) as Site;
    getStore().set(siteId, data);
    return data;
  } catch {
    return undefined;
  }
}


