import { HeroSection } from "@/components/shared/home/HeroSection";
import { ServicesSection } from "@/components/shared/home/ServicesSection";
import { LatestArticlesSection } from "@/components/shared/home/LatestArticlesSection";
import { PartnersSection } from "@/components/shared/home/PartnersSection";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function HomePage() {
  let settings;
  try {
    settings = await fetchQuery(api.settings.getSettings);
  } catch (e: any) {
    if (e.digest === "DYNAMIC_SERVER_USAGE" || e.message?.includes("Dynamic server usage") || e.message?.includes("DYNAMIC_SERVER_USAGE")) {
      throw e;
    }
    console.error("Convex fetch failed:", e);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings?.siteName || "Betasoft",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": [settings?.phone, settings?.phone2].filter(Boolean).join(", ") || "",
      "contactType": "customer service"
    },
    "sameAs": [
      settings?.instagram || "",
      settings?.youtube || "",
      settings?.linkedin || ""
    ].filter(Boolean)
  };

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />

      {/* Slider ile Hizmetlerimiz/Çalışmalarımız kısmını ayıran üst çizgi */}
      <div className="w-full h-1.5 bg-white" />

      <ServicesSection
        servicesImageUrl={settings?.servicesImageUrl}
        worksImageUrl={settings?.worksImageUrl}
      />

      {/* Hizmetlerimiz/Çalışmalarımız kısmının bittiği yeri belirten alt çizgi */}
      <div className="w-full h-1.5 bg-white" />
      <LatestArticlesSection />
      <PartnersSection
        partnersImageUrls={settings?.partnersImageUrls}
      />

      <WhatsAppButton settings={settings} />
    </div>
  );
}
