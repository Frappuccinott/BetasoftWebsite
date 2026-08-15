import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Topbar } from "@/components/shared/Topbar";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Betasoft",
  description: "Endüstriyel Otomasyon ve Makine Çözümleri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#dc2626";
  const secondaryColor = process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#1e293b";

  return (
    <html
      lang="tr"
      className={`${inter.variable} h-full antialiased`}
      style={{
        "--app-primary": primaryColor,
        "--app-secondary": secondaryColor,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 flex flex-col shadow-sm">
          <Topbar />
          <Navbar />
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
