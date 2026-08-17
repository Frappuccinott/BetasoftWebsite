import { jwtVerify } from "jose";
import { ConvexError } from "convex/values";

/**
 * Verifies the admin session token inside a Convex mutation.
 * Throws ConvexError("Unauthorized") if the token is invalid, expired, or missing.
 *
 * Requires SESSION_SECRET to be set as a Convex environment variable
 * (same value as the Next.js SESSION_SECRET).
 */
export async function requireAdmin(sessionToken: string): Promise<void> {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new ConvexError("Server configuration error: SESSION_SECRET not set");
  }

  const key = new TextEncoder().encode(secretKey);

  try {
    const { payload } = await jwtVerify(sessionToken, key, {
      algorithms: ["HS256"],
    });

    // Verify it contains an admin role
    const user = payload.user as { role?: string } | undefined;
    if (!user || user.role !== "ADMIN") {
      throw new ConvexError("Unauthorized");
    }
  } catch (error) {
    if (error instanceof ConvexError) throw error;
    throw new ConvexError("Unauthorized");
  }
}
