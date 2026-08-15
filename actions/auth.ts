"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (email === validEmail && password === validPassword) {
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
    return { success: false, error: "Hatalı e-posta veya şifre" };
  }
}

export async function logout() {
  (await cookies()).delete("admin_session");
}
