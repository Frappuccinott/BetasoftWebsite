import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  machines: defineTable({
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"), // Relation to categories
    status: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  }).index("by_category", ["categoryId"]).index("by_slug", ["slug"]),

  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    imageUrl: v.union(v.string(), v.null()),
    status: v.string(), // e.g. "Taslak", "Aktif"
    category: v.optional(v.string()), // e.g. "Blog", "Haberler", "Teknik"
    views: v.optional(v.number()), // Makale okuma sayısı
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  galleries: defineTable({
    title: v.string(),
    coverImage: v.string(), // Resim zorunlu olsun
    images: v.array(v.string()), // Birden fazla resim
    order: v.optional(v.number()), // İsteğe bağlı sıralama
  }),

  pageViews: defineTable({
    path: v.string(),
    count: v.number(),
  }).index("by_path", ["path"]),

  settings: defineTable({
    siteName: v.optional(v.string()),
    phone: v.optional(v.string()),
    phone2: v.optional(v.string()),
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
  }),

  loginAttempts: defineTable({
    ipOrEmail: v.string(),
    attempts: v.number(),
    lastAttemptAt: v.number(),
  }).index("by_ipOrEmail", ["ipOrEmail"]),
});
