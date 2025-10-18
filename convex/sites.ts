import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const setSite = mutation({
  args: { site: v.any() },
  handler: async (ctx, { site }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("sites")
      .withIndex("by_siteId", (q) => q.eq("siteId", site.siteId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { site, title: site.title || "Untitled", updatedAt: now });
      await ctx.db.insert("versions", { siteId: site.siteId, site, createdAt: now, explanation: "initial save" });
      return existing._id;
    }
    const id = await ctx.db.insert("sites", { siteId: site.siteId, ownerId: site.ownerId, title: site.title || "Untitled", site, createdAt: now, updatedAt: now });
    await ctx.db.insert("versions", { siteId: site.siteId, site, createdAt: now, explanation: "initial save" });
    return id;
  },
});

export const getSiteById = query({
  args: { siteId: v.string() },
  handler: async (ctx, { siteId }) => {
    const doc = await ctx.db
      .query("sites")
      .withIndex("by_siteId", (q) => q.eq("siteId", siteId))
      .unique();
    return doc?.site;
  },
});


