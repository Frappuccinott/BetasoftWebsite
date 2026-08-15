import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const trackPageView = mutation({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    // Avoid tracking admin or api routes if needed
    if (args.path.startsWith("/admin") || args.path.startsWith("/api")) {
      return;
    }

    const existing = await ctx.db
      .query("pageViews")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert("pageViews", { path: args.path, count: 1 });
    }
  },
});

export const trackArticleView = mutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.articleId);
    if (article) {
      await ctx.db.patch(args.articleId, { views: (article.views || 0) + 1 });
    }
  },
});

export const getSiteStats = query({
  args: {},
  handler: async (ctx) => {
    // 1. Total Site Views (sum of all pageViews counts)
    const allViews = await ctx.db.query("pageViews").collect();
    const totalSiteViews = allViews.reduce((acc, view) => acc + view.count, 0);

    // 2. Total Article Views (sum of views field in articles)
    const articles = await ctx.db.query("articles").collect();
    const totalArticleViews = articles.reduce((acc, article) => acc + (article.views || 0), 0);

    // We can also get top 5 articles by view count
    const topArticles = [...articles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    return {
      totalSiteViews,
      totalArticleViews,
      topArticles,
    };
  },
});
