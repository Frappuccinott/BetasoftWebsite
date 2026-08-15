import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getArticles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("articles").order("desc").collect();
  },
});

export const getActiveArticles = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").order("desc").collect();
    return articles.filter(a => a.status === "Aktif");
  },
});

export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getArticleById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createArticle = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    status: v.string(),
    category: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      return { success: false, error: "Bu URL (slug) zaten kullanımda." };
    }

    const id = await ctx.db.insert("articles", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      imageUrl: args.imageUrl,
      status: args.status,
      category: args.category,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true, id };
  },
});

export const updateArticle = mutation({
  args: {
    id: v.id("articles"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    status: v.string(),
    category: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
      
    if (existing && existing._id !== args.id) {
      return { success: false, error: "Bu URL (slug) zaten kullanımda." };
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      slug: args.slug,
      content: args.content,
      imageUrl: args.imageUrl,
      status: args.status,
      category: args.category,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true };
  },
});

export const deleteArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true, error: undefined };
  },
});
