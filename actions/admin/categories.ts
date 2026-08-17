"use server";

import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { getSessionToken } from "./helpers";
import { Id } from "@/convex/_generated/dataModel";

export async function createCategory(args: {
  name: string;
  slug: string;
  imageUrl: string | null;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.categories.createCategory, {
    sessionToken,
    ...args,
  });
}

export async function updateCategory(args: {
  id: Id<"categories">;
  name: string;
  slug: string;
  imageUrl: string | null;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.categories.updateCategory, {
    sessionToken,
    ...args,
  });
}

export async function deleteCategory(args: { id: Id<"categories"> }) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.categories.deleteCategory, {
    sessionToken,
    ...args,
  });
}
