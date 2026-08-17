import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin } from "./auth";

export const getMachines = query({
  args: {},
  handler: async (ctx) => {
    // Return all machines, maybe we can join categories manually if needed
    const machines = await ctx.db.query("machines").collect();
    
    // Join with categories to get category name
    return await Promise.all(
      machines.map(async (m) => {
        const category = await ctx.db.get(m.categoryId);
        return {
          ...m,
          categoryName: category?.name || "Kategori Bulunamadı",
          categorySlug: category?.slug || "",
        };
      })
    );
  },
});

export const getMachinesByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("machines")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
  },
});

export const getMachineBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const machine = await ctx.db
      .query("machines")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
      
    if (!machine) return null;
    if (machine.status !== "Aktif") return null;
    
    const category = await ctx.db.get(machine.categoryId);
    return {
      ...machine,
      categoryName: category?.name || "",
      categorySlug: category?.slug || "",
    };
  },
});

export const createMachine = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    description: v.string(),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(args.sessionToken);
    const existing = await ctx.db
      .query("machines")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
      
    if (existing) {
      return { success: false, error: "Bu isimde bir makine zaten mevcut!" };
    }

    const id = await ctx.db.insert("machines", {
      name: args.name,
      slug: args.slug,
      categoryId: args.categoryId,
      status: "Aktif",
      description: args.description,
      features: args.features,
      imageUrls: args.imageUrls,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true, id, error: undefined };
  },
});

export const deleteMachine = mutation({
  args: { sessionToken: v.string(), id: v.id("machines") },
  handler: async (ctx, args) => {
    await requireAdmin(args.sessionToken);
    await ctx.db.delete(args.id);
    return { success: true, error: undefined };
  },
});

export const getMachineById = query({
  args: { id: v.id("machines") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateMachine = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("machines"),
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    description: v.string(),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(args.sessionToken);
    const existing = await ctx.db
      .query("machines")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
      
    if (existing && existing._id !== args.id) {
      return { success: false, error: "Bu isimde bir makine zaten mevcut!" };
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      slug: args.slug,
      categoryId: args.categoryId,
      description: args.description,
      features: args.features,
      imageUrls: args.imageUrls,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      keywords: args.keywords,
    });
    
    return { success: true, error: undefined };
  },
});
