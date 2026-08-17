import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("settings").first();
  },
});

export const updateSettings = mutation({
  args: {
    siteName: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneName: v.optional(v.string()),
    phone2: v.optional(v.string()),
    phone2Name: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    mapLink: v.optional(v.string()),
    instagram: v.optional(v.string()),
    youtube: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    whatsappEnabled: v.optional(v.boolean()),
    servicesImageUrl: v.optional(v.string()),
    worksImageUrl: v.optional(v.string()),
    partnersImageUrls: v.optional(v.array(v.string())),
    slideImageUrls: v.optional(v.array(v.string())),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
    aboutText: v.optional(v.string()),
    aboutImageUrl: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    installationImageUrl: v.optional(v.string()),
    maintenanceImageUrl: v.optional(v.string()),
    automationImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return { success: true, id: existing._id, error: undefined };
    } else {
      const id = await ctx.db.insert("settings", args);
      return { success: true, id, error: undefined };
    }
  },
});
