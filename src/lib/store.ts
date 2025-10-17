import type { Site } from "@/lib/siteSchema";

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
  return getStore().get(siteId);
}


