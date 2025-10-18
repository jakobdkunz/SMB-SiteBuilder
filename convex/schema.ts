import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sites: defineTable({
    siteId: v.string(),
    ownerId: v.optional(v.string()),
    title: v.string(),
    site: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_siteId", ["siteId"]),
  versions: defineTable({
    siteId: v.string(),
    explanation: v.optional(v.string()),
    site: v.any(),
    createdAt: v.number(),
  }).index("by_siteId", ["siteId"]),
});


