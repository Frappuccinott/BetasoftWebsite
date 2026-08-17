import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
}

/**
 * Server-side Convex client for use in Server Actions.
 * This client can call public mutations/queries via HTTP.
 */
export const convexServer = new ConvexHttpClient(convexUrl);
