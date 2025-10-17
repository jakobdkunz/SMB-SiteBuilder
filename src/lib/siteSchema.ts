import { z } from "zod";

export const BlockTypeEnum = z.enum(["hero","features","services","testimonials","contact","footer"]);

export const BlockSchema = z.object({
  id: z.string(),
  type: BlockTypeEnum,
  variant: z.string().default("default"),
  props: z.record(z.string(), z.any()).default({}),
});

export const SiteSchema = z.object({
  _id: z.string().optional(),
  siteId: z.string(),
  ownerId: z.string().optional(),
  title: z.string().default("Untitled"),
  seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
  theme: z.object({
    primary: z.string(),
    accent: z.string().optional(),
    fontFamily: z.string().default("Inter"),
  }),
  blocks: z.array(BlockSchema),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Site = z.infer<typeof SiteSchema>;
export type Block = z.infer<typeof BlockSchema>;


