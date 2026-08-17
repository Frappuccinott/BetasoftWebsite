"use server";

import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { getSessionToken } from "./helpers";
import { Id } from "@/convex/_generated/dataModel";

export async function createArticle(args: {
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  status: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.articles.createArticle, {
    sessionToken,
    ...args,
  });
}

export async function updateArticle(args: {
  id: Id<"articles">;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  status: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.articles.updateArticle, {
    sessionToken,
    ...args,
  });
}

export async function deleteArticle(args: { id: Id<"articles"> }) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.articles.deleteArticle, {
    sessionToken,
    ...args,
  });
}
