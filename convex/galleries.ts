import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGalleries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("galleries").order("desc").collect();
  },
});

export const getGalleryById = query({
  args: { id: v.id("galleries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createGallery = mutation({
  args: {
    title: v.string(),
    coverImage: v.string(),
    images: v.array(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("galleries", {
      title: args.title,
      coverImage: args.coverImage,
      images: args.images,
      order: args.order || 0,
    });
    
    return { success: true, id, error: undefined };
  },
});

export const updateGallery = mutation({
  args: {
    id: v.id("galleries"),
    title: v.string(),
    coverImage: v.string(),
    images: v.array(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      coverImage: args.coverImage,
      images: args.images,
      order: args.order,
    });
    
    return { success: true, error: undefined };
  },
});

export const deleteGallery = mutation({
  args: { id: v.id("galleries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, error: undefined };
  },
});
