"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export function HeroSection() {
  const settings = useQuery(api.settings.getSettings);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use dynamic images from settings if available
  const dynamicImages = settings?.slideImageUrls && settings.slideImageUrls.length > 0 
    ? settings.slideImageUrls.map((url, idx) => ({ id: idx, url, alt: `Slide ${idx + 1}` }))
    : [];

  useEffect(() => {
    if (dynamicImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicImages.length);
    }, 5000); // 5 seconds autoplay

    return () => clearInterval(timer);
  }, [dynamicImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dynamicImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dynamicImages.length) % dynamicImages.length);
  };

  if (dynamicImages.length === 0) return null;

  return (
    <section className="relative w-full h-[600px] flex items-center bg-zinc-900 overflow-hidden group">
      {/* Background Slider */}
      {dynamicImages.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.url}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Overlay to ensure text readability (Siyahlık oranını buradaki bg-black/40 kısmından ayarlayabilirsiniz. Örn: bg-black/50, bg-black/30, bg-transparent) */}
      <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-300" />
      
      {/* Decorative Grid/Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] z-10 opacity-60" />

      {/* Slider Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/60 text-white/50 hover:text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Önceki resim"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/60 text-white/50 hover:text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Sonraki resim"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {dynamicImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary scale-125' : 'bg-white/30 hover:bg-white/70'}`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            Endüstriyel Üretimde <br />
            <span className="text-primary">Geleceğin Teknolojisi</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl drop-shadow-md">
            Sektörünüze özel yenilikçi makine çözümleri ve tam kapsamlı otomasyon sistemleri ile üretim hattınızı bir üst seviyeye taşıyın.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/cozumler" 
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary/90 transition-all shadow-lg"
            >
              Çözümleri İncele
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/iletisim" 
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 font-medium px-6 py-3 rounded-md hover:bg-white/20 transition-all backdrop-blur-sm shadow-lg"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
