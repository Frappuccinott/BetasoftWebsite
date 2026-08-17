"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import { timingSafeEqual } from "crypto";
import { convexServer } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";

function safeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a || "");
  const bBuf = Buffer.from(b || "");
  if (aBuf.length !== bBuf.length) {
    // To prevent timing leaks based on string length, we compare aBuf with itself
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "E-posta ve şifre zorunludur" };
  }

  // Rate Limiting Kontrolü (Brute-force Koruması)
  const rateLimit = await convexServer.mutation(api.login.checkRateLimit, { ipOrEmail: email });
  if (!rateLimit.allowed) {
    const retryMinutes = Math.ceil((rateLimit.retryAfterMs || 0) / 1000 / 60);
    return { success: false, error: `Çok fazla hatalı deneme. Lütfen ${retryMinutes} dakika sonra tekrar deneyin.` };
  }

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  const emailMatch = safeCompare(email, validEmail || "");
  const passwordMatch = safeCompare(password, validPassword || "");

  if (emailMatch && passwordMatch) {
    // Başarılı giriş, hatalı denemeleri sıfırla
    await convexServer.mutation(api.login.resetAttempts, { ipOrEmail: email });

    // Şifreler eşleşti, oturum oluşturuluyor
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 gün
    const sessionToken = await encrypt({ user: { email, role: "ADMIN" }, expires });

    (await cookies()).set("admin_session", sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } else {
    // Hatalı giriş, deneme sayısını artır
    await convexServer.mutation(api.login.recordFailedAttempt, { ipOrEmail: email });
    return { success: false, error: "Hatalı e-posta veya şifre" };
  }
}

export async function logout() {
  (await cookies()).delete("admin_session");
}
