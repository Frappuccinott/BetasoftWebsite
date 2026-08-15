import { HeroSection } from "@/components/shared/home/HeroSection";
import { ServicesSection } from "@/components/shared/home/ServicesSection";
import { LatestArticlesSection } from "@/components/shared/home/LatestArticlesSection";
import { PartnersSection } from "@/components/shared/home/PartnersSection";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <HeroSection />
      <ServicesSection />
      <LatestArticlesSection />
      <PartnersSection />
      
      <WhatsAppButton />
    </div>
  );
}
