"use server";

import { cookies } from "next/headers";

/**
 * Reads the admin session token from the httpOnly cookie.
 * Returns the token string or null if not present.
 * This token is then passed to Convex mutations as the sessionToken argument.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value ?? null;
}
