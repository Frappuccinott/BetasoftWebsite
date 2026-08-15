import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

// Hangi yolların bu middleware'den geçeceğini belirliyoruz
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Oturum token'ını oku
  const sessionToken = request.cookies.get("admin_session")?.value;
  let isAuth = false;

  if (sessionToken) {
    const payload = await decrypt(sessionToken);
    if (payload) {
      isAuth = true;
    }
  }

  // Eğer kullanıcı sadece "/admin" adresine girdiyse
  if (path === "/admin") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Dashboard veya alt sayfalara girmeye çalışıyor ama giriş yapmamış
  if (path.startsWith("/admin/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Zaten giriş yapmış ama tekrar login sayfasına gitmeye çalışıyor
  if (path === "/admin/login" && isAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}
