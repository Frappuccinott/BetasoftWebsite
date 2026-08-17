import { v } from "convex/values";
import { mutation } from "./_generated/server";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 dakika

export const checkRateLimit = mutation({
  args: { ipOrEmail: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("loginAttempts")
      .withIndex("by_ipOrEmail", (q) => q.eq("ipOrEmail", args.ipOrEmail))
      .first();

    if (!record) return { allowed: true };

    const now = Date.now();
    // Eğer kilitlenme süresi geçtiyse, hakları sıfırla
    if (now - record.lastAttemptAt > LOCKOUT_DURATION) {
      await ctx.db.patch(record._id, { attempts: 0 });
      return { allowed: true };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      return {
        allowed: false,
        retryAfterMs: LOCKOUT_DURATION - (now - record.lastAttemptAt),
      };
    }

    return { allowed: true };
  },
});

export const recordFailedAttempt = mutation({
  args: { ipOrEmail: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("loginAttempts")
      .withIndex("by_ipOrEmail", (q) => q.eq("ipOrEmail", args.ipOrEmail))
      .first();

    const now = Date.now();

    if (!record) {
      await ctx.db.insert("loginAttempts", {
        ipOrEmail: args.ipOrEmail,
        attempts: 1,
        lastAttemptAt: now,
      });
    } else {
      const attempts = now - record.lastAttemptAt > LOCKOUT_DURATION ? 1 : record.attempts + 1;
      await ctx.db.patch(record._id, {
        attempts,
        lastAttemptAt: now,
      });
    }
  },
});

export const resetAttempts = mutation({
  args: { ipOrEmail: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("loginAttempts")
      .withIndex("by_ipOrEmail", (q) => q.eq("ipOrEmail", args.ipOrEmail))
      .first();

    if (record) {
      await ctx.db.delete(record._id);
    }
  },
});
