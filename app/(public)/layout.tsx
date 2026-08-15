import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Topbar } from "@/components/shared/Topbar";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ViewTracker } from "@/components/shared/ViewTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {
    console.error("Convex fetch failed:", e);
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = settings?.metaTitle || settings?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || "Betasoft";
  const description = settings?.metaDescription || "Endüstriyel Otomasyon ve Makine Çözümleri";
  const keywords = settings?.keywords ? settings.keywords.split(',').map((k: string) => k.trim()) : ["Makine", "Otomasyon", "Endüstriyel"];
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: siteUrl,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e) {
    console.error("Convex fetch failed:", e);
  }

  const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#dc2626";
  const secondaryColor = process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#1e293b";

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
      style={{
        "--app-primary": primaryColor,
        "--app-secondary": secondaryColor,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>
          <ViewTracker />
          <header className="sticky top-0 z-50 flex flex-col shadow-sm">
            <Topbar settings={settings} />
            <Navbar settings={settings} />
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer settings={settings} />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
