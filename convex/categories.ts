import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
      
    if (existing) {
      return { success: false, error: "Bu isimde bir kategori zaten mevcut!" };
    }

    const id = await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true, id, error: undefined };
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const machines = await ctx.db
      .query("machines")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .collect();
      
    if (machines.length > 0) {
      return { success: false, error: "Bu kategoriye ait makineler var. Önce makineleri silmelisiniz." };
    }

    await ctx.db.delete(args.id);
    return { success: true, error: undefined };
  },
});

export const getCategoryById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
      
    if (existing && existing._id !== args.id) {
      return { success: false, error: "Bu isimde bir kategori zaten mevcut!" };
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true, error: undefined };
  },
});
