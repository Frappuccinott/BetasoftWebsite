"use client";

import "./globals.css";
import Link from "next/link";
import { Cog, Wrench, AlertTriangle, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function NotFound() {
  const [fixed, setFixed] = useState(false);
  const [clicks, setClicks] = useState(0);

  // Mini game logic: Click the broken gear 3 times to fix it
  const handleFix = () => {
    if (fixed) return;
    const newClicks = clicks + 1;
    setClicks(newClicks);
    if (newClicks >= 3) {
      setFixed(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f2e_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        
        {/* Error Badge */}
        <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full mb-8 border border-red-500/20">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wider">SİSTEM ARIZASI: 404</span>
        </div>

        {/* Gears Animation Area */}
        <div className="relative w-64 h-64 mb-8">
          {/* Main Gear - Working */}
          <Cog 
            className={`absolute top-0 left-4 w-32 h-32 text-zinc-700 ${fixed ? 'animate-[spin_4s_linear_infinite]' : 'animate-none'}`} 
          />
          
          {/* Second Gear - Working */}
          <Cog 
            className={`absolute top-14 left-32 w-24 h-24 text-zinc-600 ${fixed ? 'animate-[spin_3s_linear_infinite_reverse]' : 'animate-none'}`} 
          />
          
          {/* Third Gear - The Broken One */}
          <button 
            onClick={handleFix}
            disabled={fixed}
            className={`absolute transition-all duration-500 ${
              fixed 
                ? 'top-28 left-4 w-28 h-28 text-primary animate-[spin_3.5s_linear_infinite]' 
                : 'top-[150%] left-12 w-28 h-28 text-red-500 hover:text-red-400 rotate-45 cursor-pointer'
            }`}
          >
            <Cog className="w-full h-full" />
            {!fixed && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400 whitespace-nowrap bg-red-950/80 px-2 py-1 rounded">
                Tamir Et ({3 - clicks})
              </span>
            )}
          </button>
          
          {/* Tool Icon when broken */}
          {!fixed && (
            <Wrench className="absolute bottom-0 right-10 w-12 h-12 text-zinc-500 -rotate-45 opacity-50" />
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
          {fixed ? "SİSTEM ONARILDI!" : "DİŞLİLER DAĞILDI!"}
        </h1>
        
        <p className="text-zinc-400 text-lg mb-10 h-14">
          {fixed 
            ? "Tebrikler! Makineyi başarıyla tamir ettiniz. Artık üretime devam edebilirsiniz."
            : "Aradığınız sayfa bulunamadı veya makinede bir arıza var. Aşağıdaki kırmızı çarkı 3 kez tıklayarak yerine takın!"}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {fixed ? (
            <Link 
              href="/"
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Üretime Dön (Anasayfa)
            </Link>
          ) : (
            <Link 
              href="/"
              className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              Tamir Etmeden Ayrıl
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
