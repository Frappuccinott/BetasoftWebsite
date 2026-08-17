"use server";

import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { getSessionToken } from "./helpers";
import { Id } from "@/convex/_generated/dataModel";

export async function createMachine(args: {
  name: string;
  slug: string;
  categoryId: Id<"categories">;
  description: string;
  features: string[];
  imageUrls: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.machines.createMachine, {
    sessionToken,
    ...args,
  });
}

export async function updateMachine(args: {
  id: Id<"machines">;
  name: string;
  slug: string;
  categoryId: Id<"categories">;
  description: string;
  features: string[];
  imageUrls: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.machines.updateMachine, {
    sessionToken,
    ...args,
  });
}

export async function deleteMachine(args: { id: Id<"machines"> }) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.machines.deleteMachine, {
    sessionToken,
    ...args,
  });
}
