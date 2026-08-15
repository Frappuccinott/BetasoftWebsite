"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ViewTracker() {
  const pathname = usePathname();
  const trackPageView = useMutation(api.analytics.trackPageView);
  
  // Sadece path değiştiğinde track etmesini garantilemek için ref kullanıyoruz
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // pathname bazen null olabilir (örn: next.config'de tanımlanmayan bir root yapısında), kontrol edelim
    if (!pathname) return;
    
    // Aynı oturumda (SPA geçişlerinde) aynı sayfa tekrar render edilirse sayacı şişirmemek için
    // basit bir kontrol yapabiliriz, ya da her sayfa ziyaretini sayabiliriz. 
    // Şimdilik her sayfa değiştiğinde sayıyoruz.
    trackPageView({ path: pathname }).catch(console.error);
    
  }, [pathname, trackPageView]);

  return null;
}
