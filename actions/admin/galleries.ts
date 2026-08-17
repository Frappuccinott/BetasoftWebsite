"use server";

import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { getSessionToken } from "./helpers";
import { Id } from "@/convex/_generated/dataModel";

export async function createGallery(args: {
  title: string;
  coverImage: string;
  images: string[];
  order?: number;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.galleries.createGallery, {
    sessionToken,
    ...args,
  });
}

export async function updateGallery(args: {
  id: Id<"galleries">;
  title: string;
  coverImage: string;
  images: string[];
  order?: number;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.galleries.updateGallery, {
    sessionToken,
    ...args,
  });
}

export async function deleteGallery(args: { id: Id<"galleries"> }) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.galleries.deleteGallery, {
    sessionToken,
    ...args,
  });
}
