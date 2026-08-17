"use server";

import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { getSessionToken } from "./helpers";

export async function updateSettings(args: {
  siteName?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  mapLink?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  whatsappEnabled?: boolean;
  servicesImageUrl?: string;
  worksImageUrl?: string;
  partnersImageUrls?: string[];
  slideImageUrls?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  aboutText?: string;
  aboutImageUrl?: string;
  yearsOfExperience?: number;
  installationImageUrl?: string;
  maintenanceImageUrl?: string;
  automationImageUrl?: string;
}) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { success: false, error: "Unauthorized" };
  }
  return await convexServer.mutation(api.settings.updateSettings, {
    sessionToken,
    ...args,
  });
}
